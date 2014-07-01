import random, string, os, shutil

def genRandString(length):
    return ''.join(random.choice(string.ascii_lowercase) for i in xrange(length))

def strToNum(s):
    x = []
    for c in s:
        # a is 97
        x.append(ord(c)-96)
    return x

def addStrsToNum(strs):
    currSum = [0]*len(strs[0])
    for s in strs:
        x = strToNum(s)
        for i in xrange(len(currSum)):
            currSum[i] += x[i]
    return currSum

def subtractNumsToStr(s1, s2):
    r = ''
    for i in xrange(len(s1)):
        subtract = (s1[i] - s2[i] - 1) % 26 + 1
        r += chr(subtract + 96)
    return r

if os.path.exists("lvls"):
    shutil.rmtree("lvls")
os.makedirs("lvls")

fin = open("lvlIndexSrc.html")
lvlIndexSrc = fin.read()
fin.close()
fout = open("lvls/index.html", "w")
fout.write(lvlIndexSrc)
fout.close()

fin = open("lvlSrc.html")
lvlSrc = fin.read()
fin.close()

numLvls = 10
target = "rankings"
lvls = []
for i in xrange(numLvls):
    lvls.append(genRandString(len(target)))
lvls.append(subtractNumsToStr(strToNum(target), addStrsToNum(lvls)))

for i in xrange(numLvls):
    os.makedirs("lvls/" + lvls[i])
    fout = open("lvls/" + lvls[i] + "/index.html", "w")
    fout.write(lvlSrc);
    fout.close()
    foutJs = open("lvls/" + lvls[i] + "/magic.js", "w")
    foutJs.write("var currentMap = " + str(i+1) + ";");
    foutJs.write("var nextMap = \"" + lvls[i+1] + "\";");
    foutJs.close()

fin = open("last.html")
lastSrc = fin.read()
fin.close()
os.makedirs("lvls/" + lvls[-1]);
fout = open("lvls/" + lvls[-1] + "/index.html", "w")
fout.write(lastSrc)
fout.close()
foutJs = open("lvls/" + lvls[-1] + "/last.js", "w")
output = "var levels = [\n";
for i in xrange(numLvls):
    output += '"' + lvls[i] + '", \n'
output = output[:-3] + '];'
foutJs.write(output)
foutJs.close()
print lvls

fin = open("first.html")
firstSrc = fin.read()
fin.close()
firstSrc = firstSrc.replace("http://example.com", "http://apark93.mit.edu/layzors/lvls/" + lvls[0])
foutHtml = open("index.html", "w")
foutHtml.write(firstSrc)
foutHtml.close()
