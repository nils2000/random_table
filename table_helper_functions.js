function roll_d(nr) {
    return Math.floor((Math.random() * nr) + 1);
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
    for (var i = 0; i < raw_table.rows.length; i++) {
        //console.log(i, values_from_row(raw_table.rows[i]));
        var temp = values_from_row(raw_table.rows[i]);
        var text = temp[1].replace(/\n/g, "");
        text = text.replace(/\t/g, "");
        ret[i] = { "text": text, "probability": create_set_of_numbers(temp[0]) }
    }
    return ret;
}

function get_entry_from_random_table(number_rolled, table_name) {
    var ret = {};
    Object.values(table_name).forEach(
        e => {
            var prob = e.probability;
            if (prob.has(number_rolled))
                ret = e;
        }
    );
    return ret;
}