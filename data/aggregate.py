import csv
import math

ofile  = open('california_days.csv', "wb")
writer = csv.writer(ofile, delimiter=',')

with open('California_unito.csv', 'rbU') as csvfile:
    reader=csv.reader(csvfile,delimiter=';')
    headers = reader.next()
    nuHeaders = headers[0:3]+headers[4:len(headers)]
    print nuHeaders
    writer.writerow(nuHeaders)

    currValues=[];
    card=0;
    num=0;
    currDay=[]
    for r in reader:
    	l= len(r)
    	if r[3] is '0':
    		num=num+1
    		final = currDay+[round(x/card,3) for x in currValues]
    		writer.writerow(final)
    		#print final, num+1
    		a=[float(i) for i in r[4:l]]
    		currValues=a
    		currDay=r[0:3]		
    		
    		card=1
    		currValue = r[3]

    	else:
    		a=[float(i) for i in r[4:l]]
    		currValues = [x + y for x, y in zip(currValues, a)]
    		card=card+1

