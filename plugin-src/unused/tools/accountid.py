
result = ""

with open('accountid.txt', 'r') as infile:
    lines = infile.readlines()
    totallines = len(lines)
    linecounter = 0
    lineindex = 0
    with open('accountsout.txt', 'w') as outfile:
        for line in lines:
            line = line.strip('\n').strip()
            print('Line ' + str(lineindex) + '/' + str(totallines))
            lineindex += 1
            if linecounter == 0:
                outfile.write(line.strip('accountid:') + ':')
                linecounter += 1
                continue
            elif linecounter == 1:
                linecounter += 1
                continue
            elif linecounter == 2:
                outfile.write(line + '\n')
                linecounter = 0
                continue

print(result)
