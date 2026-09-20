// Patient Data for EHR Simulation
// This file simulates a database of patients.
// MRN: Medical Record Number (Unique to patient, starts with 'S', 7 digits)
// Account Number: Visit Number (Unique to visit, starts with 'S', 9-10 digits)

window.PATIENT_DATABASE = [
    {
        mrn: "S1234567",
        accountNumber: "S123456789",
        lastName: "Smith",
        firstName: "John",
        middleName: "Andrew",
        dob: "1965-05-15",
        gender: "male",
        address: "123 Maple Avenue",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        phone: "(555) 123-4567",
        email: "john.smith@email.com",
        emergencyContact: {
            name: "Mary Smith",
            relationship: "Spouse",
            phone: "(555) 987-6543"
        },
        allergies: "Penicillin (Severe - Anaphylaxis)",
        codeStatus: "full-code",
        insurance: {
            provider: "Blue Cross Blue Shield",
            policyNumber: "XYZ123456789",
            groupNumber: "GRP98765"
        },
        medicalHistory: {
            htn: true,
            dm: false,
            cad: false,
            copd: false,
            ckd: false,
            chf: false,
            notes: "Hyperlipidemia diagnosed 2010"
        },
        surgicalHistory: "Appendectomy (1985), Cholecystectomy (2015)",
        familyHistory: {
            cancer: false,
            heart: true,
            dm: false,
            notes: "Father - MI at 65, Mother - HTN"
        },
        socialHistory: {
            tobacco: "former",
            alcohol: "social",
            drugs: "none",
            occupation: "Retired Accountant",
            notes: "Lives with spouse in single-story home"
        },
        admissionDate: "2023-10-25"
    },
    {
        mrn: "S7654321",
        accountNumber: "S987654321",
        lastName: "Doe",
        firstName: "Jane",
        middleName: "Marie",
        dob: "1982-11-30",
        gender: "female",
        address: "456 Oak Street",
        city: "Lincoln",
        state: "NE",
        zip: "68508",
        phone: "(555) 555-0199",
        email: "jane.doe@email.com",
        emergencyContact: {
            name: "Robert Doe",
            relationship: "Brother",
            phone: "(555) 555-0100"
        },
        allergies: "Sulfa Drugs (Moderate - Rash), Latex (Mild - Itching)",
        codeStatus: "dnr",
        insurance: {
            provider: "Aetna",
            policyNumber: "AE12345678",
            groupNumber: "AE998877"
        },
        admissionDate: "2023-10-26"
    }
    ,
    {
        "mrn": "S2494502",
        "accountNumber": "S129226334",
        "lastName": "Salazar",
        "firstName": "Jose",
        "middleName": "A.",
        "dob": "1967-11-29",
        "gender": "male",
        "address": "4345 San Pedro Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78221",
        "phone": "(210) 607-3955",
        "email": "jose.salazar@email.com",
        "emergencyContact": {
            "name": "Jennifer Salazar",
            "relationship": "Parent",
            "phone": "(210) 980-6624"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED13584105",
            "groupNumber": "MED11423"
        },
        "admissionDate": "2023-11-01"
    },
    {
        "mrn": "S2427101",
        "accountNumber": "S222482569",
        "lastName": "Sanchez",
        "firstName": "Jennifer",
        "middleName": "A.",
        "dob": "1972-06-06",
        "gender": "female",
        "address": "1454 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 485-5110",
        "email": "jennifer.sanchez@email.com",
        "emergencyContact": {
            "name": "Linda Sanchez",
            "relationship": "Sibling",
            "phone": "(210) 394-1229"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP97855018",
            "groupNumber": "GRP53462"
        },
        "admissionDate": "2023-10-12"
    },
    {
        "mrn": "S3781320",
        "accountNumber": "S426407480",
        "lastName": "Sanchez",
        "firstName": "Adriana",
        "middleName": "A.",
        "dob": "2002-08-28",
        "gender": "female",
        "address": "4967 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 482-8420",
        "email": "adriana.sanchez@email.com",
        "emergencyContact": {
            "name": "Martha Sanchez",
            "relationship": "Child",
            "phone": "(210) 624-5255"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED87296606",
            "groupNumber": "MED82933"
        },
        "admissionDate": "2023-10-08"
    },
    {
        "mrn": "S3888025",
        "accountNumber": "S738995145",
        "lastName": "Reyes",
        "firstName": "Jose",
        "middleName": "R.",
        "dob": "1972-01-01",
        "gender": "male",
        "address": "6420 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78209",
        "phone": "(210) 865-9455",
        "email": "jose.reyes@email.com",
        "emergencyContact": {
            "name": "Veronica Reyes",
            "relationship": "Sibling",
            "phone": "(210) 617-2727"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP40759831",
            "groupNumber": "GRP89811"
        },
        "admissionDate": "2023-10-19"
    },
    {
        "mrn": "S2636897",
        "accountNumber": "S528998855",
        "lastName": "Garza",
        "firstName": "John",
        "middleName": "R.",
        "dob": "2002-03-27",
        "gender": "male",
        "address": "5708 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78216",
        "phone": "(210) 516-6602",
        "email": "john.garza@email.com",
        "emergencyContact": {
            "name": "Maria Garza",
            "relationship": "Parent",
            "phone": "(210) 230-8357"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE48673765",
            "groupNumber": "AE26392"
        },
        "admissionDate": "2023-10-31"
    },
    {
        "mrn": "S6991748",
        "accountNumber": "S664140535",
        "lastName": "Vasquez",
        "firstName": "Sylvia",
        "middleName": "J.",
        "dob": "1976-12-02",
        "gender": "female",
        "address": "3132 Potranco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78250",
        "phone": "(210) 381-5529",
        "email": "sylvia.vasquez@email.com",
        "emergencyContact": {
            "name": "Sarah Vasquez",
            "relationship": "Parent",
            "phone": "(210) 995-6796"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC37109846",
            "groupNumber": "UHC44274"
        },
        "admissionDate": "2023-11-20"
    },
    {
        "mrn": "S2263429",
        "accountNumber": "S683380353",
        "lastName": "Salazar",
        "firstName": "Maria",
        "middleName": "A.",
        "dob": "1958-05-30",
        "gender": "female",
        "address": "8849 Zarzamora St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78213",
        "phone": "(210) 894-5783",
        "email": "maria.salazar@email.com",
        "emergencyContact": {
            "name": "Leticia Salazar",
            "relationship": "Sibling",
            "phone": "(210) 967-8018"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM20621183",
            "groupNumber": "HUM80008"
        },
        "admissionDate": "2023-11-12"
    },
    {
        "mrn": "S1514447",
        "accountNumber": "S183396295",
        "lastName": "Vasquez",
        "firstName": "Miguel",
        "middleName": "J.",
        "dob": "1976-11-29",
        "gender": "male",
        "address": "9764 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78223",
        "phone": "(210) 683-4337",
        "email": "miguel.vasquez@email.com",
        "emergencyContact": {
            "name": "Linda Vasquez",
            "relationship": "Child",
            "phone": "(210) 356-5863"
        },
        "allergies": "Codeine (Moderate - Nausea)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM82865305",
            "groupNumber": "HUM50138"
        },
        "admissionDate": "2023-10-11"
    },
    {
        "mrn": "S8424932",
        "accountNumber": "S135450639",
        "lastName": "Chavez",
        "firstName": "Jose",
        "middleName": "L.",
        "dob": "1953-10-02",
        "gender": "male",
        "address": "3468 Bandera Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78223",
        "phone": "(210) 313-6509",
        "email": "jose.chavez@email.com",
        "emergencyContact": {
            "name": "Gabriela Chavez",
            "relationship": "Parent",
            "phone": "(210) 997-7465"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED40592006",
            "groupNumber": "MED62383"
        },
        "admissionDate": "2023-11-16"
    },
    {
        "mrn": "S8793939",
        "accountNumber": "S978091971",
        "lastName": "Mendoza",
        "firstName": "Veronica",
        "middleName": "M.",
        "dob": "1984-05-20",
        "gender": "female",
        "address": "8511 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78254",
        "phone": "(210) 701-7304",
        "email": "veronica.mendoza@email.com",
        "emergencyContact": {
            "name": "Michelle Mendoza",
            "relationship": "Spouse",
            "phone": "(210) 406-4153"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM91490738",
            "groupNumber": "HUM28667"
        },
        "admissionDate": "2023-11-19"
    },
    {
        "mrn": "S2873514",
        "accountNumber": "S893460610",
        "lastName": "Flores",
        "firstName": "Adriana",
        "middleName": "L.",
        "dob": "1987-12-09",
        "gender": "female",
        "address": "9656 San Pedro Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78223",
        "phone": "(210) 204-3447",
        "email": "adriana.flores@email.com",
        "emergencyContact": {
            "name": "Elizabeth Flores",
            "relationship": "Spouse",
            "phone": "(210) 609-8294"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED82459785",
            "groupNumber": "MED29271"
        },
        "admissionDate": "2023-11-17"
    },
    {
        "mrn": "S6018916",
        "accountNumber": "S570099964",
        "lastName": "Reyes",
        "firstName": "Francisco",
        "middleName": "R.",
        "dob": "1999-01-27",
        "gender": "male",
        "address": "9327 Broadway St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78253",
        "phone": "(210) 995-4694",
        "email": "francisco.reyes@email.com",
        "emergencyContact": {
            "name": "Ana Reyes",
            "relationship": "Spouse",
            "phone": "(210) 337-8967"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP18153210",
            "groupNumber": "GRP39762"
        },
        "admissionDate": "2023-10-17"
    },
    {
        "mrn": "S7078281",
        "accountNumber": "S548313356",
        "lastName": "Sanchez",
        "firstName": "Alejandro",
        "middleName": "L.",
        "dob": "1994-01-31",
        "gender": "male",
        "address": "3425 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 417-5133",
        "email": "alejandro.sanchez@email.com",
        "emergencyContact": {
            "name": "Linda Sanchez",
            "relationship": "Child",
            "phone": "(210) 574-2933"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD98925444",
            "groupNumber": "MCD73691"
        },
        "admissionDate": "2023-10-19"
    },
    {
        "mrn": "S3574664",
        "accountNumber": "S295084157",
        "lastName": "Salazar",
        "firstName": "Yolanda",
        "middleName": "R.",
        "dob": "1941-05-21",
        "gender": "female",
        "address": "5747 S Flores St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78217",
        "phone": "(210) 851-8699",
        "email": "yolanda.salazar@email.com",
        "emergencyContact": {
            "name": "Rosa Salazar",
            "relationship": "Spouse",
            "phone": "(210) 985-6969"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE77976612",
            "groupNumber": "AE59588"
        },
        "admissionDate": "2023-10-14"
    },
    {
        "mrn": "S3040601",
        "accountNumber": "S951621918",
        "lastName": "Ramirez",
        "firstName": "Ashley",
        "middleName": "A.",
        "dob": "1999-11-28",
        "gender": "female",
        "address": "8158 Blanco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78251",
        "phone": "(210) 434-1681",
        "email": "ashley.ramirez@email.com",
        "emergencyContact": {
            "name": "Veronica Ramirez",
            "relationship": "Sibling",
            "phone": "(210) 362-1870"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC22623530",
            "groupNumber": "UHC43994"
        },
        "admissionDate": "2023-10-17"
    },
    {
        "mrn": "S4098565",
        "accountNumber": "S349439003",
        "lastName": "Garcia",
        "firstName": "Manuel",
        "middleName": "A.",
        "dob": "1976-10-17",
        "gender": "male",
        "address": "8745 Nacogdoches Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 485-5035",
        "email": "manuel.garcia@email.com",
        "emergencyContact": {
            "name": "Yolanda Garcia",
            "relationship": "Sibling",
            "phone": "(210) 972-3504"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE82314548",
            "groupNumber": "AE18837"
        },
        "admissionDate": "2023-10-26"
    },
    {
        "mrn": "S7073457",
        "accountNumber": "S307681958",
        "lastName": "Alvarez",
        "firstName": "Sarah",
        "middleName": "J.",
        "dob": "1945-01-28",
        "gender": "female",
        "address": "2653 Broadway St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 547-8336",
        "email": "sarah.alvarez@email.com",
        "emergencyContact": {
            "name": "Elizabeth Alvarez",
            "relationship": "Child",
            "phone": "(210) 551-6734"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP77307511",
            "groupNumber": "GRP60924"
        },
        "admissionDate": "2023-10-14"
    },
    {
        "mrn": "S4017064",
        "accountNumber": "S390766230",
        "lastName": "Chavez",
        "firstName": "Yolanda",
        "middleName": "A.",
        "dob": "1991-10-02",
        "gender": "female",
        "address": "7342 Bandera Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78213",
        "phone": "(210) 712-7895",
        "email": "yolanda.chavez@email.com",
        "emergencyContact": {
            "name": "Gabriela Chavez",
            "relationship": "Child",
            "phone": "(210) 371-8343"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP94205475",
            "groupNumber": "GRP68200"
        },
        "admissionDate": "2023-10-12"
    },
    {
        "mrn": "S9451534",
        "accountNumber": "S135484833",
        "lastName": "Ortiz",
        "firstName": "Daniel",
        "middleName": "M.",
        "dob": "1953-01-24",
        "gender": "male",
        "address": "8322 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 459-8707",
        "email": "daniel.ortiz@email.com",
        "emergencyContact": {
            "name": "Claudia Ortiz",
            "relationship": "Spouse",
            "phone": "(210) 384-1757"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD87679513",
            "groupNumber": "MCD29648"
        },
        "admissionDate": "2023-11-07"
    },
    {
        "mrn": "S8912973",
        "accountNumber": "S928252513",
        "lastName": "Martinez",
        "firstName": "Christopher",
        "middleName": "L.",
        "dob": "1954-11-30",
        "gender": "male",
        "address": "6508 Nacogdoches Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78253",
        "phone": "(210) 724-2606",
        "email": "christopher.martinez@email.com",
        "emergencyContact": {
            "name": "Gabriela Martinez",
            "relationship": "Parent",
            "phone": "(210) 705-6891"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC35710097",
            "groupNumber": "UHC73122"
        },
        "admissionDate": "2023-10-30"
    },
    {
        "mrn": "S6660399",
        "accountNumber": "S154297396",
        "lastName": "Chavez",
        "firstName": "Linda",
        "middleName": "R.",
        "dob": "2003-08-22",
        "gender": "female",
        "address": "1885 Guadalupe St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 594-7451",
        "email": "linda.chavez@email.com",
        "emergencyContact": {
            "name": "Adriana Chavez",
            "relationship": "Sibling",
            "phone": "(210) 824-4458"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP96688254",
            "groupNumber": "GRP45783"
        },
        "admissionDate": "2023-10-01"
    },
    {
        "mrn": "S9266827",
        "accountNumber": "S352324463",
        "lastName": "Garcia",
        "firstName": "Sarah",
        "middleName": "M.",
        "dob": "1968-10-09",
        "gender": "female",
        "address": "5438 Fredericksburg Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78230",
        "phone": "(210) 688-8620",
        "email": "sarah.garcia@email.com",
        "emergencyContact": {
            "name": "Rosa Garcia",
            "relationship": "Child",
            "phone": "(210) 697-9997"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE30548749",
            "groupNumber": "AE30802"
        },
        "admissionDate": "2023-11-15"
    },
    {
        "mrn": "S1926888",
        "accountNumber": "S127826453",
        "lastName": "Martinez",
        "firstName": "Manuel",
        "middleName": "L.",
        "dob": "1978-06-30",
        "gender": "male",
        "address": "4434 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78233",
        "phone": "(210) 468-1911",
        "email": "manuel.martinez@email.com",
        "emergencyContact": {
            "name": "Sylvia Martinez",
            "relationship": "Sibling",
            "phone": "(210) 683-3855"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM25008751",
            "groupNumber": "HUM75415"
        },
        "admissionDate": "2023-10-28"
    },
    {
        "mrn": "S6214191",
        "accountNumber": "S897276832",
        "lastName": "Chavez",
        "firstName": "Jesus",
        "middleName": "J.",
        "dob": "1994-08-11",
        "gender": "male",
        "address": "4271 S Flores St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 955-3096",
        "email": "jesus.chavez@email.com",
        "emergencyContact": {
            "name": "Yolanda Chavez",
            "relationship": "Parent",
            "phone": "(210) 491-4291"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED58727875",
            "groupNumber": "MED96953"
        },
        "admissionDate": "2023-10-17"
    },
    {
        "mrn": "S6800640",
        "accountNumber": "S666749793",
        "lastName": "Diaz",
        "firstName": "Patricia",
        "middleName": "J.",
        "dob": "1941-02-08",
        "gender": "female",
        "address": "2935 Rigsby Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78232",
        "phone": "(210) 727-5822",
        "email": "patricia.diaz@email.com",
        "emergencyContact": {
            "name": "Rosa Diaz",
            "relationship": "Sibling",
            "phone": "(210) 792-1465"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM48534106",
            "groupNumber": "HUM36659"
        },
        "admissionDate": "2023-11-19"
    },
    {
        "mrn": "S8358634",
        "accountNumber": "S563960919",
        "lastName": "Hernandez",
        "firstName": "Linda",
        "middleName": "M.",
        "dob": "1942-01-08",
        "gender": "female",
        "address": "7605 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78245",
        "phone": "(210) 741-7028",
        "email": "linda.hernandez@email.com",
        "emergencyContact": {
            "name": "Elizabeth Hernandez",
            "relationship": "Parent",
            "phone": "(210) 529-3781"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE28909394",
            "groupNumber": "AE46340"
        },
        "admissionDate": "2023-11-04"
    },
    {
        "mrn": "S8945865",
        "accountNumber": "S913421322",
        "lastName": "Rodriguez",
        "firstName": "Christopher",
        "middleName": "L.",
        "dob": "1987-12-05",
        "gender": "male",
        "address": "2688 Culebra Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78221",
        "phone": "(210) 670-4905",
        "email": "christopher.rodriguez@email.com",
        "emergencyContact": {
            "name": "Ana Rodriguez",
            "relationship": "Spouse",
            "phone": "(210) 531-1745"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE55526092",
            "groupNumber": "AE95312"
        },
        "admissionDate": "2023-11-16"
    },
    {
        "mrn": "S3114301",
        "accountNumber": "S614966161",
        "lastName": "Gomez",
        "firstName": "Michelle",
        "middleName": "R.",
        "dob": "1987-12-23",
        "gender": "female",
        "address": "5965 Potranco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78251",
        "phone": "(210) 713-8240",
        "email": "michelle.gomez@email.com",
        "emergencyContact": {
            "name": "Yolanda Gomez",
            "relationship": "Child",
            "phone": "(210) 419-1443"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED39384855",
            "groupNumber": "MED34869"
        },
        "admissionDate": "2023-11-26"
    }

    ,
    {
        "mrn": "S9927086",
        "accountNumber": "S201417024",
        "lastName": "Williams",
        "firstName": "Shaniqua",
        "middleName": "R.",
        "dob": "1995-04-18",
        "gender": "female",
        "address": "9182 Guadalupe St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 830-4117",
        "email": "shaniqua.williams@email.com",
        "emergencyContact": {
            "name": "Elizabeth Williams",
            "relationship": "Parent",
            "phone": "(210) 614-9080"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE19374588",
            "groupNumber": "AE34484"
        },
        "admissionDate": "2023-11-20"
    },
    {
        "mrn": "S6335596",
        "accountNumber": "S969387988",
        "lastName": "Jimenez",
        "firstName": "Miguel",
        "middleName": "M.",
        "dob": "1985-11-15",
        "gender": "male",
        "address": "4365 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 718-3410",
        "email": "miguel.jimenez@email.com",
        "emergencyContact": {
            "name": "Jessica Jimenez",
            "relationship": "Sibling",
            "phone": "(210) 959-8587"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD68311538",
            "groupNumber": "MCD81289"
        },
        "admissionDate": "2023-11-09"
    },
    {
        "mrn": "S6861024",
        "accountNumber": "S209903174",
        "lastName": "Jones",
        "firstName": "Elizabeth",
        "middleName": "L.",
        "dob": "1971-03-02",
        "gender": "female",
        "address": "2712 Broadway St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78253",
        "phone": "(210) 838-4444",
        "email": "elizabeth.jones@email.com",
        "emergencyContact": {
            "name": "Sarah Jones",
            "relationship": "Sibling",
            "phone": "(210) 649-8757"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED95210657",
            "groupNumber": "MED97280"
        },
        "admissionDate": "2023-11-12"
    },
    {
        "mrn": "S9271306",
        "accountNumber": "S170913307",
        "lastName": "Jimenez",
        "firstName": "Martha",
        "middleName": "L.",
        "dob": "1992-12-05",
        "gender": "female",
        "address": "4796 De Zavala Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 412-1307",
        "email": "martha.jimenez@email.com",
        "emergencyContact": {
            "name": "Claudia Jimenez",
            "relationship": "Child",
            "phone": "(210) 229-2042"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED96804145",
            "groupNumber": "MED39259"
        },
        "admissionDate": "2023-11-09"
    },
    {
        "mrn": "S2102335",
        "accountNumber": "S970083739",
        "lastName": "Lewis",
        "firstName": "Robert",
        "middleName": "M.",
        "dob": "1967-10-02",
        "gender": "male",
        "address": "9041 Zarzamora St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 460-2782",
        "email": "robert.lewis@email.com",
        "emergencyContact": {
            "name": "Maria Lewis",
            "relationship": "Sibling",
            "phone": "(210) 930-2921"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP69668909",
            "groupNumber": "GRP14167"
        },
        "admissionDate": "2023-10-06"
    },
    {
        "mrn": "S2764143",
        "accountNumber": "S239297833",
        "lastName": "Chavez",
        "firstName": "Robert",
        "middleName": "A.",
        "dob": "1965-08-27",
        "gender": "male",
        "address": "1281 Tezel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78233",
        "phone": "(210) 704-5425",
        "email": "robert.chavez@email.com",
        "emergencyContact": {
            "name": "Maria Chavez",
            "relationship": "Parent",
            "phone": "(210) 705-8827"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE46474455",
            "groupNumber": "AE60040"
        },
        "admissionDate": "2023-11-18"
    },
    {
        "mrn": "S5427829",
        "accountNumber": "S620508377",
        "lastName": "Walker",
        "firstName": "Ebony",
        "middleName": "J.",
        "dob": "1982-05-20",
        "gender": "female",
        "address": "6360 Wurzbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78216",
        "phone": "(210) 723-4802",
        "email": "ebony.walker@email.com",
        "emergencyContact": {
            "name": "Maria Walker",
            "relationship": "Child",
            "phone": "(210) 474-5434"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC87851751",
            "groupNumber": "UHC83144"
        },
        "admissionDate": "2023-10-23"
    },
    {
        "mrn": "S6928668",
        "accountNumber": "S462409241",
        "lastName": "Walker",
        "firstName": "Donald",
        "middleName": "A.",
        "dob": "1973-03-06",
        "gender": "male",
        "address": "4522 Guadalupe St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78245",
        "phone": "(210) 940-1487",
        "email": "donald.walker@email.com",
        "emergencyContact": {
            "name": "Sandra Walker",
            "relationship": "Child",
            "phone": "(210) 229-4745"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP45090591",
            "groupNumber": "GRP78451"
        },
        "admissionDate": "2023-11-03"
    },
    {
        "mrn": "S8162394",
        "accountNumber": "S554959292",
        "lastName": "Martinez",
        "firstName": "Jesus",
        "middleName": "J.",
        "dob": "1947-11-13",
        "gender": "male",
        "address": "4093 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78230",
        "phone": "(210) 783-1443",
        "email": "jesus.martinez@email.com",
        "emergencyContact": {
            "name": "Michelle Martinez",
            "relationship": "Spouse",
            "phone": "(210) 958-2520"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD81658783",
            "groupNumber": "MCD87746"
        },
        "admissionDate": "2023-10-13"
    },
    {
        "mrn": "S9424302",
        "accountNumber": "S697892016",
        "lastName": "Wilson",
        "firstName": "Christopher",
        "middleName": "A.",
        "dob": "1951-04-08",
        "gender": "male",
        "address": "3505 Vance Jackson Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78230",
        "phone": "(210) 241-8361",
        "email": "christopher.wilson@email.com",
        "emergencyContact": {
            "name": "Lisa Wilson",
            "relationship": "Parent",
            "phone": "(210) 201-7883"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM34376538",
            "groupNumber": "HUM98989"
        },
        "admissionDate": "2023-10-10"
    },
    {
        "mrn": "S6754009",
        "accountNumber": "S885841047",
        "lastName": "Thompson",
        "firstName": "Karen",
        "middleName": "L.",
        "dob": "1995-03-15",
        "gender": "female",
        "address": "282 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78212",
        "phone": "(210) 278-6248",
        "email": "karen.thompson@email.com",
        "emergencyContact": {
            "name": "Barbara Thompson",
            "relationship": "Sibling",
            "phone": "(210) 384-7878"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE62433747",
            "groupNumber": "AE17849"
        },
        "admissionDate": "2023-11-13"
    },
    {
        "mrn": "S6064863",
        "accountNumber": "S396317235",
        "lastName": "Ortiz",
        "firstName": "John",
        "middleName": "R.",
        "dob": "1943-10-26",
        "gender": "male",
        "address": "6659 Blanco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78232",
        "phone": "(210) 587-3007",
        "email": "john.ortiz@email.com",
        "emergencyContact": {
            "name": "Ana Ortiz",
            "relationship": "Parent",
            "phone": "(210) 253-4890"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM61078086",
            "groupNumber": "HUM61991"
        },
        "admissionDate": "2023-11-06"
    },
    {
        "mrn": "S6228976",
        "accountNumber": "S355366703",
        "lastName": "Anderson",
        "firstName": "Patricia",
        "middleName": "M.",
        "dob": "1984-11-30",
        "gender": "female",
        "address": "9728 Wurzbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 228-4360",
        "email": "patricia.anderson@email.com",
        "emergencyContact": {
            "name": "Betty Anderson",
            "relationship": "Sibling",
            "phone": "(210) 390-4057"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC83703573",
            "groupNumber": "UHC95599"
        },
        "admissionDate": "2023-11-23"
    },
    {
        "mrn": "S6901923",
        "accountNumber": "S220228601",
        "lastName": "Alvarez",
        "firstName": "Michael",
        "middleName": "R.",
        "dob": "1982-01-01",
        "gender": "male",
        "address": "6820 Marbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 879-4827",
        "email": "michael.alvarez@email.com",
        "emergencyContact": {
            "name": "Maria Alvarez",
            "relationship": "Sibling",
            "phone": "(210) 688-6623"
        },
        "allergies": "Sulfa Drugs (Moderate - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED95080252",
            "groupNumber": "MED45890"
        },
        "admissionDate": "2023-10-01"
    },
    {
        "mrn": "S6708043",
        "accountNumber": "S403251990",
        "lastName": "Diaz",
        "firstName": "Miguel",
        "middleName": "R.",
        "dob": "1989-07-03",
        "gender": "male",
        "address": "2571 Wurzbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78247",
        "phone": "(210) 708-6581",
        "email": "miguel.diaz@email.com",
        "emergencyContact": {
            "name": "Linda Diaz",
            "relationship": "Spouse",
            "phone": "(210) 337-1029"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED28206340",
            "groupNumber": "MED38762"
        },
        "admissionDate": "2023-11-11"
    },
    {
        "mrn": "S1848814",
        "accountNumber": "S190862778",
        "lastName": "Kim",
        "firstName": "Mary",
        "middleName": "L.",
        "dob": "1973-06-30",
        "gender": "female",
        "address": "7602 Wurzbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 859-5753",
        "email": "mary.kim@email.com",
        "emergencyContact": {
            "name": "Ji-Woo Kim",
            "relationship": "Spouse",
            "phone": "(210) 672-4590"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM72203101",
            "groupNumber": "HUM80665"
        },
        "admissionDate": "2023-10-03"
    },
    {
        "mrn": "S5381786",
        "accountNumber": "S346627070",
        "lastName": "Johnson",
        "firstName": "Sarah",
        "middleName": "J.",
        "dob": "1963-08-21",
        "gender": "female",
        "address": "4377 Callaghan Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78209",
        "phone": "(210) 322-5190",
        "email": "sarah.johnson@email.com",
        "emergencyContact": {
            "name": "Linda Johnson",
            "relationship": "Parent",
            "phone": "(210) 340-4338"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED81834759",
            "groupNumber": "MED68383"
        },
        "admissionDate": "2023-10-18"
    },
    {
        "mrn": "S1185152",
        "accountNumber": "S604490469",
        "lastName": "Chen",
        "firstName": "Linda",
        "middleName": "R.",
        "dob": "1993-12-26",
        "gender": "female",
        "address": "2867 Tezel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78229",
        "phone": "(210) 694-5203",
        "email": "linda.chen@email.com",
        "emergencyContact": {
            "name": "Sakura Chen",
            "relationship": "Parent",
            "phone": "(210) 861-3505"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD29409743",
            "groupNumber": "MCD68750"
        },
        "admissionDate": "2023-11-13"
    },
    {
        "mrn": "S1693874",
        "accountNumber": "S427658477",
        "lastName": "Garza",
        "firstName": "Juan",
        "middleName": "J.",
        "dob": "1953-10-13",
        "gender": "male",
        "address": "6438 Tezel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78250",
        "phone": "(210) 808-6983",
        "email": "juan.garza@email.com",
        "emergencyContact": {
            "name": "Ana Garza",
            "relationship": "Spouse",
            "phone": "(210) 333-1678"
        },
        "allergies": "Sulfa Drugs (Moderate - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP44307586",
            "groupNumber": "GRP80382"
        },
        "admissionDate": "2023-10-03"
    },
    {
        "mrn": "S4073990",
        "accountNumber": "S996878437",
        "lastName": "Ortiz",
        "firstName": "Francisco",
        "middleName": "M.",
        "dob": "1945-11-05",
        "gender": "male",
        "address": "9908 Callaghan Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 351-9050",
        "email": "francisco.ortiz@email.com",
        "emergencyContact": {
            "name": "Michelle Ortiz",
            "relationship": "Sibling",
            "phone": "(210) 670-3071"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM36912427",
            "groupNumber": "HUM87852"
        },
        "admissionDate": "2023-11-10"
    },
    {
        "mrn": "S5515613",
        "accountNumber": "S174209924",
        "lastName": "Miller",
        "firstName": "Donald",
        "middleName": "M.",
        "dob": "1981-04-10",
        "gender": "male",
        "address": "577 Guilbeau Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78247",
        "phone": "(210) 978-2688",
        "email": "donald.miller@email.com",
        "emergencyContact": {
            "name": "Margaret Miller",
            "relationship": "Spouse",
            "phone": "(210) 456-2668"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM96362232",
            "groupNumber": "HUM66287"
        },
        "admissionDate": "2023-11-04"
    },
    {
        "mrn": "S1096569",
        "accountNumber": "S592408781",
        "lastName": "Anderson",
        "firstName": "Linda",
        "middleName": "R.",
        "dob": "1970-01-19",
        "gender": "female",
        "address": "9683 Blanco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 992-8776",
        "email": "linda.anderson@email.com",
        "emergencyContact": {
            "name": "Linda Anderson",
            "relationship": "Parent",
            "phone": "(210) 216-3792"
        },
        "allergies": "Codeine (Moderate - Nausea)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP24371629",
            "groupNumber": "GRP27224"
        },
        "admissionDate": "2023-11-14"
    },
    {
        "mrn": "S2286903",
        "accountNumber": "S802587939",
        "lastName": "Chen",
        "firstName": "Susan",
        "middleName": "L.",
        "dob": "1974-04-23",
        "gender": "female",
        "address": "7577 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78253",
        "phone": "(210) 807-6069",
        "email": "susan.chen@email.com",
        "emergencyContact": {
            "name": "Mary Chen",
            "relationship": "Child",
            "phone": "(210) 232-6860"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC15212580",
            "groupNumber": "UHC41686"
        },
        "admissionDate": "2023-11-05"
    },
    {
        "mrn": "S5193533",
        "accountNumber": "S125205598",
        "lastName": "Taylor",
        "firstName": "Donald",
        "middleName": "M.",
        "dob": "1976-08-24",
        "gender": "male",
        "address": "8403 Pleasanton Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78212",
        "phone": "(210) 269-4066",
        "email": "donald.taylor@email.com",
        "emergencyContact": {
            "name": "Margaret Taylor",
            "relationship": "Sibling",
            "phone": "(210) 984-3502"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP14159476",
            "groupNumber": "GRP63451"
        },
        "admissionDate": "2023-11-11"
    },
    {
        "mrn": "S9419231",
        "accountNumber": "S377425284",
        "lastName": "Vasquez",
        "firstName": "Francisco",
        "middleName": "A.",
        "dob": "1995-06-08",
        "gender": "male",
        "address": "2414 Blanco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 458-8553",
        "email": "francisco.vasquez@email.com",
        "emergencyContact": {
            "name": "Jennifer Vasquez",
            "relationship": "Sibling",
            "phone": "(210) 783-4973"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED63283354",
            "groupNumber": "MED34822"
        },
        "admissionDate": "2023-11-05"
    },
    {
        "mrn": "S2549640",
        "accountNumber": "S711495414",
        "lastName": "Thomas",
        "firstName": "Robert",
        "middleName": "A.",
        "dob": "1986-08-17",
        "gender": "male",
        "address": "6179 Marbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 603-3616",
        "email": "robert.thomas@email.com",
        "emergencyContact": {
            "name": "Margaret Thomas",
            "relationship": "Spouse",
            "phone": "(210) 445-6470"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP19029427",
            "groupNumber": "GRP90378"
        },
        "admissionDate": "2023-10-13"
    },
    {
        "mrn": "S7090626",
        "accountNumber": "S265172378",
        "lastName": "Gonzalez",
        "firstName": "Christopher",
        "middleName": "J.",
        "dob": "1960-03-12",
        "gender": "male",
        "address": "2566 Nacogdoches Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78223",
        "phone": "(210) 363-3157",
        "email": "christopher.gonzalez@email.com",
        "emergencyContact": {
            "name": "Sarah Gonzalez",
            "relationship": "Spouse",
            "phone": "(210) 709-7514"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP85046966",
            "groupNumber": "GRP49834"
        },
        "admissionDate": "2023-10-01"
    },
    {
        "mrn": "S3856371",
        "accountNumber": "S519734280",
        "lastName": "Torres",
        "firstName": "Jesus",
        "middleName": "J.",
        "dob": "1988-08-24",
        "gender": "male",
        "address": "7741 Callaghan Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78221",
        "phone": "(210) 720-7344",
        "email": "jesus.torres@email.com",
        "emergencyContact": {
            "name": "Michelle Torres",
            "relationship": "Spouse",
            "phone": "(210) 638-8041"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE28506255",
            "groupNumber": "AE29644"
        },
        "admissionDate": "2023-10-24"
    },
    {
        "mrn": "S5683921",
        "accountNumber": "S137635888",
        "lastName": "Martin",
        "firstName": "James",
        "middleName": "R.",
        "dob": "2004-02-15",
        "gender": "male",
        "address": "5706 Pleasanton Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78251",
        "phone": "(210) 852-6430",
        "email": "james.martin@email.com",
        "emergencyContact": {
            "name": "Margaret Martin",
            "relationship": "Parent",
            "phone": "(210) 517-8602"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC70383715",
            "groupNumber": "UHC95996"
        },
        "admissionDate": "2023-10-18"
    },
    {
        "mrn": "S1042171",
        "accountNumber": "S854699992",
        "lastName": "Moore",
        "firstName": "Michael",
        "middleName": "L.",
        "dob": "1963-12-09",
        "gender": "male",
        "address": "7016 West Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 884-1042",
        "email": "michael.moore@email.com",
        "emergencyContact": {
            "name": "Lisa Moore",
            "relationship": "Parent",
            "phone": "(210) 594-8033"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE41712959",
            "groupNumber": "AE23634"
        },
        "admissionDate": "2023-11-09"
    },
    {
        "mrn": "S8728571",
        "accountNumber": "S771096282",
        "lastName": "Rivera",
        "firstName": "Michelle",
        "middleName": "J.",
        "dob": "1996-04-12",
        "gender": "female",
        "address": "7999 Babcock Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78233",
        "phone": "(210) 374-5112",
        "email": "michelle.rivera@email.com",
        "emergencyContact": {
            "name": "Patricia Rivera",
            "relationship": "Parent",
            "phone": "(210) 970-8584"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM52855276",
            "groupNumber": "HUM55406"
        },
        "admissionDate": "2023-10-11"
    },
    {
        "mrn": "S9360444",
        "accountNumber": "S345858905",
        "lastName": "Jimenez",
        "firstName": "Antonio",
        "middleName": "A.",
        "dob": "1987-02-09",
        "gender": "male",
        "address": "9215 Nacogdoches Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78217",
        "phone": "(210) 436-9450",
        "email": "antonio.jimenez@email.com",
        "emergencyContact": {
            "name": "Linda Jimenez",
            "relationship": "Parent",
            "phone": "(210) 436-9280"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE11757703",
            "groupNumber": "AE33681"
        },
        "admissionDate": "2023-11-16"
    },
    {
        "mrn": "S8625659",
        "accountNumber": "S124652215",
        "lastName": "Ramirez",
        "firstName": "Jose",
        "middleName": "J.",
        "dob": "2000-04-23",
        "gender": "male",
        "address": "957 Babcock Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78212",
        "phone": "(210) 215-6050",
        "email": "jose.ramirez@email.com",
        "emergencyContact": {
            "name": "Sarah Ramirez",
            "relationship": "Spouse",
            "phone": "(210) 629-5942"
        },
        "allergies": "Sulfa Drugs (Moderate - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP44067629",
            "groupNumber": "GRP62537"
        },
        "admissionDate": "2023-10-15"
    },
    {
        "mrn": "S9459674",
        "accountNumber": "S772762571",
        "lastName": "Robinson",
        "firstName": "Ebony",
        "middleName": "L.",
        "dob": "1989-01-14",
        "gender": "female",
        "address": "2886 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78221",
        "phone": "(210) 512-5337",
        "email": "ebony.robinson@email.com",
        "emergencyContact": {
            "name": "Margaret Robinson",
            "relationship": "Parent",
            "phone": "(210) 347-8394"
        },
        "allergies": "Penicillin (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE21505539",
            "groupNumber": "AE45667"
        },
        "admissionDate": "2023-11-10"
    },
    {
        "mrn": "S9644485",
        "accountNumber": "S657181073",
        "lastName": "Ortiz",
        "firstName": "Robert",
        "middleName": "R.",
        "dob": "2004-04-22",
        "gender": "male",
        "address": "7857 Guilbeau Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78240",
        "phone": "(210) 415-9292",
        "email": "robert.ortiz@email.com",
        "emergencyContact": {
            "name": "Maria Ortiz",
            "relationship": "Child",
            "phone": "(210) 803-5424"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP48339966",
            "groupNumber": "GRP99473"
        },
        "admissionDate": "2023-10-03"
    },
    {
        "mrn": "S1682734",
        "accountNumber": "S577514808",
        "lastName": "Martinez",
        "firstName": "James",
        "middleName": "A.",
        "dob": "1968-10-20",
        "gender": "male",
        "address": "5220 Roosevelt Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 402-5849",
        "email": "james.martinez@email.com",
        "emergencyContact": {
            "name": "Gabriela Martinez",
            "relationship": "Spouse",
            "phone": "(210) 888-8362"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM19177682",
            "groupNumber": "HUM29865"
        },
        "admissionDate": "2023-10-15"
    },
    {
        "mrn": "S6123182",
        "accountNumber": "S434960538",
        "lastName": "Gomez",
        "firstName": "Carlos",
        "middleName": "L.",
        "dob": "1955-02-09",
        "gender": "male",
        "address": "2633 De Zavala Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 914-3014",
        "email": "carlos.gomez@email.com",
        "emergencyContact": {
            "name": "Michelle Gomez",
            "relationship": "Parent",
            "phone": "(210) 850-8028"
        },
        "allergies": "Codeine (Moderate - Nausea)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC16153935",
            "groupNumber": "UHC29019"
        },
        "admissionDate": "2023-11-17"
    },
    {
        "mrn": "S1108635",
        "accountNumber": "S932870308",
        "lastName": "Martinez",
        "firstName": "Antonio",
        "middleName": "L.",
        "dob": "1960-04-01",
        "gender": "male",
        "address": "6634 Bandera Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 426-8757",
        "email": "antonio.martinez@email.com",
        "emergencyContact": {
            "name": "Ana Martinez",
            "relationship": "Sibling",
            "phone": "(210) 965-8541"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC54851564",
            "groupNumber": "UHC40569"
        },
        "admissionDate": "2023-11-23"
    },
    {
        "mrn": "S3492061",
        "accountNumber": "S446991146",
        "lastName": "Diaz",
        "firstName": "Michelle",
        "middleName": "R.",
        "dob": "2002-06-19",
        "gender": "female",
        "address": "6858 San Pedro Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78254",
        "phone": "(210) 419-9335",
        "email": "michelle.diaz@email.com",
        "emergencyContact": {
            "name": "Ana Diaz",
            "relationship": "Child",
            "phone": "(210) 640-1741"
        },
        "allergies": "Sulfa Drugs (Moderate - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD88687773",
            "groupNumber": "MCD81888"
        },
        "admissionDate": "2023-10-13"
    },
    {
        "mrn": "S5807667",
        "accountNumber": "S207849696",
        "lastName": "Johnson",
        "firstName": "William",
        "middleName": "L.",
        "dob": "1940-09-01",
        "gender": "male",
        "address": "8392 Military Dr",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 343-8627",
        "email": "william.johnson@email.com",
        "emergencyContact": {
            "name": "Sarah Johnson",
            "relationship": "Child",
            "phone": "(210) 498-8058"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE77287072",
            "groupNumber": "AE20293"
        },
        "admissionDate": "2023-10-21"
    },
    {
        "mrn": "S9042661",
        "accountNumber": "S344507215",
        "lastName": "Hernandez",
        "firstName": "David",
        "middleName": "R.",
        "dob": "1997-12-05",
        "gender": "male",
        "address": "5691 Guilbeau Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78217",
        "phone": "(210) 247-8983",
        "email": "david.hernandez@email.com",
        "emergencyContact": {
            "name": "Sarah Hernandez",
            "relationship": "Sibling",
            "phone": "(210) 718-6130"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM41931183",
            "groupNumber": "HUM23552"
        },
        "admissionDate": "2023-10-12"
    },
    {
        "mrn": "S2222307",
        "accountNumber": "S300636764",
        "lastName": "Garza",
        "firstName": "Mary",
        "middleName": "J.",
        "dob": "1966-03-15",
        "gender": "female",
        "address": "2207 Guilbeau Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78201",
        "phone": "(210) 208-6532",
        "email": "mary.garza@email.com",
        "emergencyContact": {
            "name": "Ashley Garza",
            "relationship": "Child",
            "phone": "(210) 949-8854"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM28494783",
            "groupNumber": "HUM82736"
        },
        "admissionDate": "2023-10-19"
    },
    {
        "mrn": "S5385553",
        "accountNumber": "S662269873",
        "lastName": "Lewis",
        "firstName": "Michael",
        "middleName": "R.",
        "dob": "1998-04-24",
        "gender": "male",
        "address": "4611 San Pedro Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78251",
        "phone": "(210) 774-3997",
        "email": "michael.lewis@email.com",
        "emergencyContact": {
            "name": "Jessica Lewis",
            "relationship": "Parent",
            "phone": "(210) 665-7795"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED10990663",
            "groupNumber": "MED47248"
        },
        "admissionDate": "2023-11-01"
    },
    {
        "mrn": "S6642372",
        "accountNumber": "S904223988",
        "lastName": "Jackson",
        "firstName": "Anthony",
        "middleName": "J.",
        "dob": "1954-05-05",
        "gender": "male",
        "address": "6036 San Pedro Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78247",
        "phone": "(210) 206-7481",
        "email": "anthony.jackson@email.com",
        "emergencyContact": {
            "name": "Ebony Jackson",
            "relationship": "Parent",
            "phone": "(210) 273-9078"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP13355182",
            "groupNumber": "GRP53531"
        },
        "admissionDate": "2023-11-24"
    },
    {
        "mrn": "S2519124",
        "accountNumber": "S850789701",
        "lastName": "Vasquez",
        "firstName": "Jessica",
        "middleName": "M.",
        "dob": "1990-10-18",
        "gender": "female",
        "address": "5611 Evers Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78229",
        "phone": "(210) 713-8926",
        "email": "jessica.vasquez@email.com",
        "emergencyContact": {
            "name": "Maria Vasquez",
            "relationship": "Child",
            "phone": "(210) 491-6341"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED89225616",
            "groupNumber": "MED47489"
        },
        "admissionDate": "2023-10-08"
    },
    {
        "mrn": "S1699735",
        "accountNumber": "S592932755",
        "lastName": "Davis",
        "firstName": "Daniel",
        "middleName": "M.",
        "dob": "2005-04-24",
        "gender": "male",
        "address": "4429 Tezel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78228",
        "phone": "(210) 942-7191",
        "email": "daniel.davis@email.com",
        "emergencyContact": {
            "name": "Sandra Davis",
            "relationship": "Parent",
            "phone": "(210) 445-5377"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED63950018",
            "groupNumber": "MED58984"
        },
        "admissionDate": "2023-10-13"
    },
    {
        "mrn": "S8892290",
        "accountNumber": "S103355293",
        "lastName": "Thomas",
        "firstName": "Mary",
        "middleName": "L.",
        "dob": "1957-08-30",
        "gender": "female",
        "address": "8987 Blanco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 453-3946",
        "email": "mary.thomas@email.com",
        "emergencyContact": {
            "name": "Margaret Thomas",
            "relationship": "Spouse",
            "phone": "(210) 605-6992"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP38351252",
            "groupNumber": "GRP60870"
        },
        "admissionDate": "2023-10-11"
    },
    {
        "mrn": "S7602917",
        "accountNumber": "S231358344",
        "lastName": "Thompson",
        "firstName": "Margaret",
        "middleName": "J.",
        "dob": "1981-07-28",
        "gender": "female",
        "address": "8697 De Zavala Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78240",
        "phone": "(210) 643-9287",
        "email": "margaret.thompson@email.com",
        "emergencyContact": {
            "name": "Karen Thompson",
            "relationship": "Spouse",
            "phone": "(210) 248-1957"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD89623479",
            "groupNumber": "MCD94532"
        },
        "admissionDate": "2023-10-15"
    },
    {
        "mrn": "S3483987",
        "accountNumber": "S139062000",
        "lastName": "Gutierrez",
        "firstName": "Jennifer",
        "middleName": "L.",
        "dob": "1945-09-24",
        "gender": "female",
        "address": "3417 Evers Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 299-4704",
        "email": "jennifer.gutierrez@email.com",
        "emergencyContact": {
            "name": "Martha Gutierrez",
            "relationship": "Child",
            "phone": "(210) 265-1710"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE61691046",
            "groupNumber": "AE52540"
        },
        "admissionDate": "2023-11-14"
    },
    {
        "mrn": "S4950648",
        "accountNumber": "S149992487",
        "lastName": "Davis",
        "firstName": "Susan",
        "middleName": "A.",
        "dob": "1995-12-10",
        "gender": "female",
        "address": "8630 De Zavala Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 248-3678",
        "email": "susan.davis@email.com",
        "emergencyContact": {
            "name": "Mary Davis",
            "relationship": "Spouse",
            "phone": "(210) 806-7315"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC10806858",
            "groupNumber": "UHC52191"
        },
        "admissionDate": "2023-11-08"
    },
    {
        "mrn": "S9982539",
        "accountNumber": "S946029125",
        "lastName": "Flores",
        "firstName": "Patricia",
        "middleName": "J.",
        "dob": "1955-12-07",
        "gender": "female",
        "address": "3440 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78213",
        "phone": "(210) 977-4871",
        "email": "patricia.flores@email.com",
        "emergencyContact": {
            "name": "Ana Flores",
            "relationship": "Parent",
            "phone": "(210) 482-8599"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC93345544",
            "groupNumber": "UHC17422"
        },
        "admissionDate": "2023-11-15"
    },
    {
        "mrn": "S9094030",
        "accountNumber": "S148800633",
        "lastName": "Thompson",
        "firstName": "Linda",
        "middleName": "J.",
        "dob": "1994-07-08",
        "gender": "female",
        "address": "3331 Potranco Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 985-9201",
        "email": "linda.thompson@email.com",
        "emergencyContact": {
            "name": "Patricia Thompson",
            "relationship": "Parent",
            "phone": "(210) 988-1588"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM14344837",
            "groupNumber": "HUM90834"
        },
        "admissionDate": "2023-10-07"
    },
    {
        "mrn": "S2442855",
        "accountNumber": "S668737269",
        "lastName": "Sanchez",
        "firstName": "Carlos",
        "middleName": "M.",
        "dob": "1944-07-06",
        "gender": "male",
        "address": "5837 Pleasanton Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78213",
        "phone": "(210) 337-1650",
        "email": "carlos.sanchez@email.com",
        "emergencyContact": {
            "name": "Jessica Sanchez",
            "relationship": "Parent",
            "phone": "(210) 519-2371"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC60081610",
            "groupNumber": "UHC26906"
        },
        "admissionDate": "2023-10-05"
    },
    {
        "mrn": "S7760573",
        "accountNumber": "S642654691",
        "lastName": "Morales",
        "firstName": "Ana",
        "middleName": "R.",
        "dob": "1976-03-15",
        "gender": "female",
        "address": "1713 Culebra Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78210",
        "phone": "(210) 428-4431",
        "email": "ana.morales@email.com",
        "emergencyContact": {
            "name": "Ana Morales",
            "relationship": "Parent",
            "phone": "(210) 227-2801"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED19535606",
            "groupNumber": "MED15785"
        },
        "admissionDate": "2023-11-08"
    },
    {
        "mrn": "S2447428",
        "accountNumber": "S768029514",
        "lastName": "Williams",
        "firstName": "Mary",
        "middleName": "M.",
        "dob": "1941-06-01",
        "gender": "female",
        "address": "9259 S Flores St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78247",
        "phone": "(210) 510-1607",
        "email": "mary.williams@email.com",
        "emergencyContact": {
            "name": "Nancy Williams",
            "relationship": "Sibling",
            "phone": "(210) 337-9027"
        },
        "allergies": "Shellfish (Severe - Swelling)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE24851604",
            "groupNumber": "AE47830"
        },
        "admissionDate": "2023-11-18"
    },
    {
        "mrn": "S7886969",
        "accountNumber": "S997546184",
        "lastName": "Vasquez",
        "firstName": "Claudia",
        "middleName": "J.",
        "dob": "1941-11-21",
        "gender": "female",
        "address": "1445 Huebner Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78254",
        "phone": "(210) 269-1915",
        "email": "claudia.vasquez@email.com",
        "emergencyContact": {
            "name": "Rosa Vasquez",
            "relationship": "Child",
            "phone": "(210) 865-9178"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC16272176",
            "groupNumber": "UHC79629"
        },
        "admissionDate": "2023-10-24"
    },
    {
        "mrn": "S8390571",
        "accountNumber": "S722218885",
        "lastName": "Anderson",
        "firstName": "Thomas",
        "middleName": "J.",
        "dob": "1970-08-28",
        "gender": "male",
        "address": "6334 S Presa St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78249",
        "phone": "(210) 993-4596",
        "email": "thomas.anderson@email.com",
        "emergencyContact": {
            "name": "Betty Anderson",
            "relationship": "Parent",
            "phone": "(210) 260-1729"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP12516754",
            "groupNumber": "GRP15216"
        },
        "admissionDate": "2023-10-15"
    },
    {
        "mrn": "S5474724",
        "accountNumber": "S389550258",
        "lastName": "Diaz",
        "firstName": "Elizabeth",
        "middleName": "L.",
        "dob": "2001-06-20",
        "gender": "female",
        "address": "9989 Guadalupe St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 732-2017",
        "email": "elizabeth.diaz@email.com",
        "emergencyContact": {
            "name": "Mary Diaz",
            "relationship": "Parent",
            "phone": "(210) 820-5879"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM10975354",
            "groupNumber": "HUM14666"
        },
        "admissionDate": "2023-11-05"
    },
    {
        "mrn": "S5810737",
        "accountNumber": "S426236577",
        "lastName": "Rodriguez",
        "firstName": "Linda",
        "middleName": "M.",
        "dob": "1954-11-18",
        "gender": "female",
        "address": "9450 Nacogdoches Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 537-7232",
        "email": "linda.rodriguez@email.com",
        "emergencyContact": {
            "name": "Linda Rodriguez",
            "relationship": "Child",
            "phone": "(210) 620-2950"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP83408366",
            "groupNumber": "GRP71182"
        },
        "admissionDate": "2023-10-09"
    },
    {
        "mrn": "S1551648",
        "accountNumber": "S652440640",
        "lastName": "Walker",
        "firstName": "Richard",
        "middleName": "J.",
        "dob": "1998-11-23",
        "gender": "male",
        "address": "8662 Babcock Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 900-2496",
        "email": "richard.walker@email.com",
        "emergencyContact": {
            "name": "Linda Walker",
            "relationship": "Parent",
            "phone": "(210) 961-5407"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP24480311",
            "groupNumber": "GRP67084"
        },
        "admissionDate": "2023-10-15"
    },
    {
        "mrn": "S2847665",
        "accountNumber": "S392425755",
        "lastName": "Jimenez",
        "firstName": "Michelle",
        "middleName": "L.",
        "dob": "1959-12-28",
        "gender": "female",
        "address": "8858 Perrin Beitel Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78240",
        "phone": "(210) 488-4355",
        "email": "michelle.jimenez@email.com",
        "emergencyContact": {
            "name": "Elizabeth Jimenez",
            "relationship": "Child",
            "phone": "(210) 989-1417"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicaid",
            "policyNumber": "MCD91288585",
            "groupNumber": "MCD56595"
        },
        "admissionDate": "2023-10-16"
    },
    {
        "mrn": "S9541156",
        "accountNumber": "S281251052",
        "lastName": "Lewis",
        "firstName": "Susan",
        "middleName": "A.",
        "dob": "1998-02-01",
        "gender": "female",
        "address": "9920 Zarzamora St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78258",
        "phone": "(210) 829-8685",
        "email": "susan.lewis@email.com",
        "emergencyContact": {
            "name": "Linda Lewis",
            "relationship": "Spouse",
            "phone": "(210) 526-2154"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP43089109",
            "groupNumber": "GRP44606"
        },
        "admissionDate": "2023-11-03"
    },
    {
        "mrn": "S2341838",
        "accountNumber": "S466208134",
        "lastName": "Chavez",
        "firstName": "Michael",
        "middleName": "R.",
        "dob": "1958-07-11",
        "gender": "male",
        "address": "4391 Grissom Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78216",
        "phone": "(210) 743-2066",
        "email": "michael.chavez@email.com",
        "emergencyContact": {
            "name": "Martha Chavez",
            "relationship": "Spouse",
            "phone": "(210) 359-7440"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED57972534",
            "groupNumber": "MED81605"
        },
        "admissionDate": "2023-10-10"
    },
    {
        "mrn": "S5953730",
        "accountNumber": "S682477069",
        "lastName": "Hernandez",
        "firstName": "Christopher",
        "middleName": "L.",
        "dob": "1958-11-17",
        "gender": "male",
        "address": "4581 Fredericksburg Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78253",
        "phone": "(210) 757-3937",
        "email": "christopher.hernandez@email.com",
        "emergencyContact": {
            "name": "Linda Hernandez",
            "relationship": "Child",
            "phone": "(210) 988-2979"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Medicare",
            "policyNumber": "MED25281213",
            "groupNumber": "MED56537"
        },
        "admissionDate": "2023-10-25"
    },
    {
        "mrn": "S9867771",
        "accountNumber": "S220761387",
        "lastName": "Harris",
        "firstName": "Michael",
        "middleName": "R.",
        "dob": "1941-01-10",
        "gender": "male",
        "address": "3798 Guilbeau Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78232",
        "phone": "(210) 746-6830",
        "email": "michael.harris@email.com",
        "emergencyContact": {
            "name": "Aaliyah Harris",
            "relationship": "Parent",
            "phone": "(210) 268-7535"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP94873291",
            "groupNumber": "GRP63849"
        },
        "admissionDate": "2023-11-12"
    },
    {
        "mrn": "S6777373",
        "accountNumber": "S207604219",
        "lastName": "Torres",
        "firstName": "Claudia",
        "middleName": "J.",
        "dob": "1999-09-06",
        "gender": "female",
        "address": "9349 Rigsby Ave",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78216",
        "phone": "(210) 738-7766",
        "email": "claudia.torres@email.com",
        "emergencyContact": {
            "name": "Patricia Torres",
            "relationship": "Sibling",
            "phone": "(210) 703-8840"
        },
        "allergies": "Peanuts (Severe - Anaphylaxis)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Blue Cross Blue Shield",
            "policyNumber": "GRP80990384",
            "groupNumber": "GRP33534"
        },
        "admissionDate": "2023-11-07"
    },
    {
        "mrn": "S6418463",
        "accountNumber": "S771304440",
        "lastName": "Hernandez",
        "firstName": "Christopher",
        "middleName": "J.",
        "dob": "1957-09-05",
        "gender": "male",
        "address": "2205 Babcock Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 715-9531",
        "email": "christopher.hernandez@email.com",
        "emergencyContact": {
            "name": "Ashley Hernandez",
            "relationship": "Child",
            "phone": "(210) 971-8063"
        },
        "allergies": "Iodine (Mild - Rash)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM74244254",
            "groupNumber": "HUM92847"
        },
        "admissionDate": "2023-10-26"
    },
    {
        "mrn": "S5366858",
        "accountNumber": "S273178349",
        "lastName": "Schmidt",
        "firstName": "David",
        "middleName": "A.",
        "dob": "1990-07-01",
        "gender": "male",
        "address": "6573 Wurzbach Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78240",
        "phone": "(210) 322-1899",
        "email": "david.schmidt@email.com",
        "emergencyContact": {
            "name": "Rachel Schmidt",
            "relationship": "Spouse",
            "phone": "(210) 838-7168"
        },
        "allergies": "Latex (Mild - Itching)",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "UnitedHealthcare",
            "policyNumber": "UHC70725759",
            "groupNumber": "UHC68875"
        },
        "admissionDate": "2023-11-26"
    },
    {
        "mrn": "S6709941",
        "accountNumber": "S283456226",
        "lastName": "Perez",
        "firstName": "David",
        "middleName": "L.",
        "dob": "1940-03-02",
        "gender": "male",
        "address": "3661 Huebner Rd",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78251",
        "phone": "(210) 631-8487",
        "email": "david.perez@email.com",
        "emergencyContact": {
            "name": "Rosa Perez",
            "relationship": "Sibling",
            "phone": "(210) 596-9064"
        },
        "allergies": "Aspirin (Moderate - Hives)",
        "codeStatus": "dnr",
        "insurance": {
            "provider": "Humana",
            "policyNumber": "HUM40312780",
            "groupNumber": "HUM49793"
        },
        "admissionDate": "2023-11-26"
    },
    {
        "mrn": "S3856570",
        "accountNumber": "S298432651",
        "lastName": "Schmidt",
        "firstName": "Michael",
        "middleName": "J.",
        "dob": "1970-08-18",
        "gender": "male",
        "address": "6711 Broadway St",
        "city": "San Antonio",
        "state": "TX",
        "zip": "78207",
        "phone": "(210) 894-9387",
        "email": "michael.schmidt@email.com",
        "emergencyContact": {
            "name": "Layla Schmidt",
            "relationship": "Spouse",
            "phone": "(210) 200-9373"
        },
        "allergies": "No Known Allergies",
        "codeStatus": "full-code",
        "insurance": {
            "provider": "Aetna",
            "policyNumber": "AE31502053",
            "groupNumber": "AE53404"
        },
        "admissionDate": "2023-10-16"
    }

];
