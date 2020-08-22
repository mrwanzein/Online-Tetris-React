import React from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';


const Register = () => {
    const [formVals, setFormVals] = React.useState({
        username: "",
        password: ""
    });
    const [warningMsg, setWarningMsg] = React.useState("");
    const [loadingIcon, setLoadingIcon] = React.useState(false);

    let history = useHistory();
    
    const submitHandler = async (ev, payload) => {
        ev.preventDefault();
        try {
            setLoadingIcon(true);
            const res = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            console.log(data);

            if(data.created) {
                history.push('/login');
            } else {
                setLoadingIcon(false);
                setWarningMsg(data.message);
                setFormVals({
                    username: "",
                    password: ""
                });
            }


        } catch(err) {
            console.log(err);
        }
    }
    
    const getInputValues = (ev) => {
        let name = ev.target.name;
        let val = ev.target.value;
        setFormVals({
            ...formVals,
            [name]: val
        })
    }

    return(
        <Wrapper>
            <CustomForm onSubmit={(ev) => { submitHandler(ev, formVals) }} autoComplete="off">
                <FormHeader>Please provide a username and a password</FormHeader>
                <InsideForm>
                    <FormLabels htmlFor="username" style={{marginRight: "auto"}}>Username(case sensitive)</FormLabels>
                    <CustomInput 
                        type="text"
                        name="username"
                        value={formVals.username}
                        onChange={getInputValues}
                    />
                    <CharLimitWarning>
                        {formVals.username.length > 16 ? `* ${(formVals.username.length - 16)} characters over the limit` : ""}
                    </CharLimitWarning>
                    <FormLabels htmlFor="password" style={{marginRight: "auto"}}>Password</FormLabels>
                    <CustomInput 
                        type="password"
                        name="password"
                        value={formVals.password}
                        onChange={getInputValues}
                    />
                    <WarningMessage>{warningMsg}</WarningMessage>
                    {
                        formVals.username.length <= 16 && formVals.password.length ?
                        <CustomInputSubmit type="submit">{loadingIcon ? <i className="fa fa-spinner fa-spin"></i> : "Register"}</CustomInputSubmit> :
                        <CustomInputSubmit style={{cursor: "not-allowed"}} disabled>Register</CustomInputSubmit>
                    }
                </InsideForm>
            </CustomForm>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 80px);
`;

const CustomInput = styled.input`
    width: 350px;
    margin-bottom: 30px;
    margin-right: auto;
    border-radius: 20px;
    padding: 8px 20px;
    box-sizing: border-box;
    outline: none;

    &:focus {
        border-color: blue;
        box-shadow: 0 0 5px 0 rgb(64, 64, 245);
    }
`;

const CustomForm = styled.form`
    padding: 50px 100px;
    background-color: lightcoral;
    border-radius: 10px;
    box-shadow: 0px 0px 9px -1px rgba(0,0,0,0.75);
`;

const InsideForm = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FormLabels = styled.label`
    margin-right: "auto";
    margin-bottom: 15px;
    font-size: 1.5em;
    color: white;
`;

const FormHeader = styled.span`
    display: block;
    margin-bottom: 50px;
    font-size: 2em;
    color: white;
    padding-bottom: 5px;
    border-bottom: 2px solid lightgrey;
`;

const CustomInputSubmit = styled.button`
    width: 200px;
    margin: 50px 0 0 auto;
    padding: 10px 15px;
    box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);
    border-radius: 5px;
    cursor: pointer;

    &:active {
        box-shadow: inset 0px 0px 7px -1px rgba(0,0,0,0.75);
    }
`;

const WarningMessage = styled.span`
    font-size: 1.5em;
    color: black;
    font-style: italic;
`;

const CharLimitWarning = styled.span`
    margin-right: auto;
    font-size: 1.1em;
    font-style: italic;
    margin-bottom: 20px;
`;

export default Register;