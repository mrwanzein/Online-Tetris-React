import React from 'react';
import styled from 'styled-components';

const Log_in = () => {
    const [formVals, setFormVals] = React.useState({
        username: "",
        password: ""
    });
    
    const submitHandler = (ev, payload) => {
        ev.preventDefault();
        console.log(payload);
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
                <FormHeader>Log in to your account</FormHeader>
                <InsideForm>
                    <FormLabels htmlFor="username" style={{marginRight: "auto"}}>Username</FormLabels>
                    <CustomInput 
                        type="text"
                        name="username"
                        value={formVals.username}
                        onChange={getInputValues}
                    />
                    <FormLabels htmlFor="password" style={{marginRight: "auto"}}>Password</FormLabels>
                    <CustomInput 
                        type="text"
                        name="password"
                        value={formVals.password}
                        onChange={getInputValues}
                    />
                    <CustomInputSubmit 
                        type="submit"
                        value={"Log In"}
                    />
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

const CustomInputSubmit = styled.input`
    margin-top: 35px;
    width: 200px;
    padding: 10px 15px;
    box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);
    border-radius: 5px;
    cursor: pointer;

    &:active {
        box-shadow: inset 0px 0px 7px -1px rgba(0,0,0,0.75);
    }
`;

export default Log_in;