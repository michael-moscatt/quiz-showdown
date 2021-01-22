import re

ex_1 = "toggle('clue_J_1_2', 'clue_J_1_2_stuck', '&lt;em class=&quot;correct_response&quot;&gt;&lt;i&gt;loch&lt;/i&gt;&lt;/em&gt;&lt;br /&gt;&lt;br /&gt;&lt;table width=&quot;100%&quot;&gt;&lt;tr&gt;&lt;td class=&quot;right&quot;&gt;Frank&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;')"
ex_2 = "toggle('clue_J_5_1', 'clue_J_5_1_stuck', '&lt;em class=&quot;correct_response&quot;&gt;&quot;Thriller&quot;&lt;/em&gt;&lt;br /&gt;&lt;br /&gt;&lt;table width=&quot;100%&quot;&gt;&lt;tr&gt;&lt;td class=&quot;right&quot;&gt;Frank&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;')"
ex_3 = "toggle('clue_J_3_1', 'clue_J_3_1_stuck', '&lt;em class=&quot;correct_response&quot;&gt;rats&lt;/em&gt;&lt;br /&gt;&lt;br /&gt;&lt;table width=&quot;100%&quot;&gt;&lt;tr&gt;&lt;td class=&quot;right&quot;&gt;Greg&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;')"
ex_4 = "toggle('clue_J_2_1', 'clue_J_2_1_stuck', '[ERRATUM: Greg responded correctly, but was never credited with the money.]&lt;br /&gt;&lt;br /&gt;&lt;em class=&quot;correct_response&quot;&gt;a radio&lt;/em&gt;&lt;br /&gt;&lt;br /&gt;&lt;table width=&quot;100%&quot;&gt;&lt;tr&gt;&lt;td class=&quot;wrong&quot;&gt;Triple Stumper&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;')"
ex_5 = "</tr></table><em class=\\\"correct_response\\\">(2 of) Great Britain, India, Nepal & the United Nations flag</em>')"
examples = [ex_5]
answer_regex = re.compile(r'''
                    (?:<em\ class=\\"correct_response\\">|mouse>)
                    (?:<i>)?
                    (?:")?
                    (.+?)
                    (?:")?
                    (?:</i>)?
                    (?:</em>)
                ''', re.VERBOSE)

for ex in examples:
    match = re.search(answer_regex, ex)
    if(match):
        print(match.group(1))
    else:
        print("no match")