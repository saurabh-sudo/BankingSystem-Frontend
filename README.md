# BankingSystem-Frontend

### Technology used:

TypeScript, Angular 6, Webpack, etc.


Working of Every Module:

## Backffice System:

1.  Admin would have two roles -Capturer and Authoriser.
```bash

  a.  Capturer would be responsible for feeding the details of prospect customer into the System,
      and change the Details of Customer whenever requested by the Authoriser.
  
  b.  Authoriser would be able to approve or decline the request of Account creation submitted
      by the capturer. Once Approved, the Customer account will be created along with 
      Unique Account Number and credentials for login would be sent to the Phone number of 
      Account holder.If Authoriser Decline the Request providing the reason for 
      Disapproval of account, it would be sent back to Capturer for getting the data updated.
  
  c.  Both the Capturer and Authhoriser would be able to login using their own crentials,
      which needs to be manually entered into the database at this point of time.
  
  ```
  
 ## OnlineBanking System:
 
 1.   This Module is for Customer Facing Application. In this Customer would be able to perform many functions.Eg.
 
    a. Login into their own account using credentials received through SMS.
    
    b. Check the Balance on their Account.
    
    c. View Transaction History on all the Transaction Done till the current date.
    
    d. Schedule a Transaction(Future-Dated)
    
    e. Send Money to Multiple Accounts at a time.
    
 Thank You!
