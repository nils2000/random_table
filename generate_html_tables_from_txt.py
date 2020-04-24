import argparse
import os.path
import re

parser = argparse.ArgumentParser()

parser.add_argument("filename")

args = parser.parse_args()
with open(os.path.splitext(os.path.basename(args.filename))[0] + ".html", mode='w') as write_table_file:
    write_table_file.write("<html>\n<head>\n")
    write_table_file.write("<script src='table_helper_functions.js'></script>")
    write_table_file.write(
        "\n</head>\n<body>\n<div id='display'></div>\n<table id='tabelle'>\n")
    with open(args.filename) as file:
        i = 0
        for line in file:
            write_table_file.write("<tr>\n")
            for cell in line.split("\t"):
                if (i == 1):
                    temp = re.sub('(\d*[wWd]\d+([+-]\d+)?)', lambda w: w.group(1) +
                                  ": <b name='roll' title=" + w.group(1) + "></b>", cell)
                else:
                    temp = cell
                write_table_file.write("<td>" + temp + "</td>")
            write_table_file.write("</tr>\n")
            i = 1
    write_table_file.write("</table>")
    write_table_file.write(
        "<script>resolve_table('tabelle', 'display');roll_dices();</script>")
    write_table_file.write("\n</body>\n</html>")

print("bitte sichergehen das table_helper_functions.js auch da ist ....<TODO IMPLEMNETIERE DAS!!!>")
