import re

ex_1 = "<em>MOTOR TREND</em> CAR OF THE YEAR"
ex_2 = "HELLO"
examples = [ex_1, ex_2]
answer_regex = re.compile(r'''
                    (?:<em>)?
                    (.+)
                    (?:</em>)?
                ''', re.VERBOSE)

for ex in examples:
    filtered = ex.replace("<em>", "").replace("</em>","")
    if(filtered):
        print(filtered)
    else:
        print("broke")