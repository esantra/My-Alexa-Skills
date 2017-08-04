"use strict";

let nforce = require('nforce'),

	SF_CLIENT_ID = "",
	SF_CLIENT_SECRET = '',
	SF_USER_NAME = '',
	SF_PASSWORD = '';

let org = nforce.createConnection({
	clientId: SF_CLIENT_ID,
	clientSecret: SF_CLIENT_SECRET,
	redirectUri: 'http://localhost:3000/oauth/_callback',
	mode: 'single',
	autoRefresh: true
});

let login = () => {
	org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
		if (err) {
			console.error("Authentication error");
			console.error(err);
		} else {
			console.log("Authentication successful");
		}
	});
};

let findLoanChanges = () => {
	return new Promise((resolve, reject) => {
		let ncinoQuery = `SELECT
					OldValue,
					NewValue,
					CreatedDate,
					Field,
					Parent.Id,
					Parent.Name,
					Parent.Account__c,
					Parent.Amount__c
				FROM loan__history
				WHERE field = 'Amount__c'
				ORDER BY CreatedDate DESC
				LIMIT 3`;
		org.query({query: ncinoQuery}, (err, resp) => {
			if (err) {
				reject("An error as occurred");
			} else {
				resolve(resp.records);
			}
		});
	});
};


let createLoan = (propertyId, customerName, customerId) => {

	return new Promise((resolve, reject) => {
		let ncinoLoan = nforce.createSObject('Loan__c');
		ncinoLoan.set('Account__c', 'Bank of Nigeria');
		ncinoLoan.set('Amount__c', '1000000.00');
		ncinoLoan.set('Name', 'Mortgage Loan');

		org.insert({sobject: ncinoLoan}, err => {
			if (err) {
				console.error(err);
				reject("An error occurred while creating a case");
			} else {
				resolve(ncinoLoan);
			}
		});
	});

};

login();

exports.org = org;
exports.findLoanChanges = findLoanChanges;
exports.createLoan = createLoan;