/* 
- signInService takes username and password from the signIn controller
- it then passes the username and password to the userRepo where they are compared
- if the repo returns that it is a match, the service then calls the cookie utility to create the cookie, and sends it back to the controller, where the cookie is appended and returned
- if there are any errors in this process (like UN or PW are not a match) this service returns the error back to the controller to be returned as a response.
*/

