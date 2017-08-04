"use strict";

let salesforce = require("./salesforce");

exports.Changes = (slots, session, response) => {
	salesforce.findLoanChanges()
		.then(loanChanges => {
			let alexa_phrase = "OK, here are the recent changes to loans: ";
			loanChanges.forEach(loanChange => {
					let loan = loanChange.get("Parent");
					alexa_phrase += `Loan ${loan.Name} of Account ${loan.Account__c}, ${loan.Amount__c}.<break time="0.2s"/>
							Loan amount changed from $${loanChange.get("OldValue")} to $${loanChange.get("NewValue")}.<break time="0.5s"/>`;
			});
		   response.say(alexa_phrase);
		})
		.catch((err) => {
			console.error(err);
			response.say("Oops. Something went wrong");
		});
};


exports.CreateLoan = (slots, session, response) => {
	salesforce.createLoan()
		.then(loanChanges => {
			let alexa_phrase = "nCino loan creation successful.";
			let loan = loanChanges;
			alexa_phrase = 'Loan ' + loanChanges.get('name') + ' was created with the Account ' + loanChanges.get('account__c') +
			' in the amount of ' + loanChanges.get('amount__c');
		   response.say(alexa_phrase);
		})
		.catch((err) => {
			console.error(err);
			response.say('' + err + '');
		});
};