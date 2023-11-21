import React, { useState } from 'react'

function Login()
{

var loginName;
var loginPassword;
const [message,setMessage] = useState('');


const doLogin = async event =>
{
    const app_name = 'cop4331-21-48ee0f7c9de7'
    
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production')
        {
            console.log("ONElogin")
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else
        {
            console.log("TWOlogin")
            console.log(route)
            return 'http://localhost:5000/' + route;
        }
    }

    event.preventDefault();
    var obj = {Login:loginName.value,Password:loginPassword.value};
    var obj = {Login:loginName.value,Password:loginPassword.value};
    var js = JSON.stringify(obj);

    try
    {
        console.log("sEEEand!\n")
        const response = await fetch(buildPath('api/login'), {
            method: 'POST',
            body: js,
            headers: { 'Content-Type': 'application/json' }
          });
        console.log("wich")

        var res = JSON.parse(await response.text());
        console.log(res);
        if( res.id <= 0 )
        {
            setMessage('User/Password combination incorrect');
        }
        else
        {
            var user =
            {FirstName:res.firstName,LastName:res.lastName,UserID:res.id}
            localStorage.setItem('user_data', JSON.stringify(user));
            setMessage('');
            window.location.href = '/cards';
        }
    }
    catch(e)
    {
        alert(e.toString());
        return;
    }
};



return(
<div id="loginDiv">
<form onSubmit={doLogin}>
<span id="inner-title">PLEASE LOG IN</span><br />

<input type="text" id="loginName" placeholder="Username"
ref={(c) => loginName = c} /><br />
<input type="password" id="loginPassword" placeholder="Password"
ref={(c) => loginPassword = c} /><br />

<input type="submit" id="loginButton" class="buttons" value = "Do It"

onClick={doLogin} />
</form>
<span id="loginResult">{message}</span>
</div>
);
};
export default Login;