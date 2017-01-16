Any updates to localized-strings.json and login-strings.json will require update to RxLocalizedStrings.def file under /server/extras/installforms/en

This can be done manually, or

1. run 'mvn clean install -Plocalization' from project root. This will create the necessary localized strings object in the local AR Server
2. export rx-framework application to replace RxLocalizedStrings.def in depot


