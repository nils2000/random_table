function roll_d(nr) {
    return Math.floor((Math.random() * nr) + 1) || 1;
}

class DiceRoll {
    constructor(amount, kind, modifier) {
        this.amount = amount;
        this.kind = kind;
        if (!modifier) modifier = 0;
        this.modifier = modifier;
    }
    evaluate() {
        var ret = 0;
        for (let index = 0; index < this.amount; index++) {
            ret += roll_d(this.kind);
        }
        ret += this.modifier;
        return ret;
    }
}
    DiceRoll.prototype.toString = function () {
    return String(this.evaluate());
}

class BoxOfDice {
    constructor() {
        this.dice = new Array();
    }
    evaluate() {
        var ret = 0;
        this.dice.forEach(d => ret += d.evaluate());
        return ret;
    }
    add(die) {
        this.dice.push(die);
    }
}

function create_box_of_dice_from_string(dice_string) {
    var ret = new BoxOfDice();
    var temp = dice_string.split(" + ");
    temp.forEach(die_string => ret.add(create_dice_from_string(die_string)));
    return ret;
}

function create_dice_from_string(dice_string) {
    var amount = 1;
    var type = 0;
    var modifier = 0;
    var first = dice_string;
    var split_string = "d";
    if (dice_string.includes("+")) {
        modifier = Number(dice_string.split("+")[1]);
        first = dice_string.split("+")[0];
    }
    if (dice_string.includes("-")) {
        modifier = Number(dice_string.split("-")[1]);
        first = dice_string.split("-")[0];
    }
    if (first.includes("W")) { split_string = "W"; }
    if (first.includes("w")) { split_string = "w"; }
    var tmp = first.split(split_string);
    if (tmp[0] != "") amount = Number(tmp[0]);
    type = Number(tmp[1]);
    return new DiceRoll(amount, type, modifier);
}

function roll_dices() {
    document.getElementsByName("roll").forEach(r => r.innerHTML = create_dice_from_string(r.title).evaluate());
}

class LazyString {
    constructor(list_of_strings_or_other) {
        this.list_of_strings_or_other = list_of_strings_or_other;
    }
    toString() {
        var ret = "";
        for (var i of this.list_of_strings_or_other) {
            ret += i;
        }
        return ret;
    }
}

function value_from_cell(cell_containing_only_text) {
    return cell_containing_only_text.childNodes[0].nodeValue;
}

function values_from_row(two_cell_row) {
    return [value_from_cell(two_cell_row.children[0]), value_from_cell(two_cell_row.children[1])];
}

function create_set_of_numbers(num_or_range) {
    //input should either be  a number or a range like "1-25"
    if (num_or_range.includes("-")) {
        var tmp_list = num_or_range.split("-");
        //console.log(tmp_list, Number(tmp_list[1]));
        var ret = new Set(Array(Number(tmp_list[1]) + 1).keys());
        var to_remove = new Set(Array(Number(tmp_list[0])).keys());
        to_remove.forEach(n => ret.delete(n));
        return ret;
    }
    else return new Set([Number(num_or_range)]);
}

function get_random_table_from(table_name) {
    //input table should only contain two cols
    //console.log(table_name);
    var raw_table = document.getElementById(table_name);
    //console.log(raw_table);
    var ret = {};
    var temp = values_from_row(raw_table.rows[0]);
    ret["select_dice"] = temp[0];
    ret["description_string"] = temp[1];
    ret["entries"] = {};
    for (var i = 1; i < raw_table.rows.length; i++) {
        //console.log(i, values_from_row(raw_table.rows[i]));
        var temp = values_from_row(raw_table.rows[i]);
        var text = temp[1].replace(/\n/g, "");
        text = text.replace(/\t/g, "");
        ret["entries"][i] = { "text": text, "probability": create_set_of_numbers(temp[0]) }
    }
    return ret;
}

function get_entry_from_random_table(number_rolled, table) {
    var ret = {};
    Object.values(table["entries"]).forEach(
        e => {
            var prob = e.probability;
            if (prob.has(number_rolled))
                ret = e;
        }
    );
    return ret;
}

function resolve_table(table_name, display_name) {
    var tab = get_random_table_from(table_name);
    var dice = create_box_of_dice_from_string(tab["select_dice"]);
    var display = document.getElementById(display_name);
    var result = get_entry_from_random_table(dice.evaluate(), tab);
    display.innerHTML = tab["description_string"] + " " + result.text + ".";
}