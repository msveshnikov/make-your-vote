@echo off
setlocal enabledelayedexpansion

REM Export collections with expanded fields and metadata
ssh -l ubuntu makeyour.vote "docker exec vote_mongodb_1 mongoexport --db vote --type csv --collection topics --fields _id,title,optionA,optionB,optionAImage,optionBImage,description,category,creator,status,aiAnalysis,startDate,endDate,totalVotes,tags,visibility,allowedUsers,metadata >topics.csv"
ssh -l ubuntu makeyour.vote "docker exec vote_mongodb_1 mongoexport --db vote --type csv --collection votes --fields _id,user,topic,value,sentiment,context,metadata.device,metadata.location,metadata.userAgent,metadata.browserLanguage,metadata.countryCode,metadata.countryName,metadata.ip,isAnonymous,createdAt,updatedAt >votes.csv"
ssh -l ubuntu makeyour.vote "docker exec vote_mongodb_1 mongoexport --db vote --type csv --collection users --fields _id,email,name,role,preferences,createdAt,lastLogin >users.csv"

REM Copy exported files to local machine
scp ubuntu@makeyour.vote:/home/ubuntu/topics.csv .
scp ubuntu@makeyour.vote:/home/ubuntu/votes.csv .
scp ubuntu@makeyour.vote:/home/ubuntu/users.csv .

