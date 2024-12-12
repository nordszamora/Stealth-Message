import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';

import {CHANGE_NAME, CHANGE_USERNAME, ADD_OR_CHANGE_EMAIL, CHANGE_PASSWORD, ACCOUNT_DELETION } from '../../api/settings/api';
import "./style.css";

export default function ChangeAccount(props) {
    const [show_pass_change, setShowPassChange] = useState(false);
    const [show_deletion, setShowDeletion] = useState(false);
    const [account_validated, setAccountValidated] = useState(false);
    const [changepass_validated, setChangepassValidated] = useState(false);
    const [deletion_validated, setDeletionValidated] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [add_email, setAddEmail] = useState(''); // for old user who doesn't have an email
    const [email, setEmail] = useState('');
    const [current_password, setCurrentpassword] = useState('');
    const [new_password, setNewpassword] = useState('');
    const [deletion_password, setDeletionpassword] = useState('');
    const [loading_change_account, setChangeAccountLoading] = useState(false);
    const [loading_change_pass, setChangePassLoading] = useState(false);
    const [loading_account_deletion, setAccountDeletionLoading] = useState(false);
    const [info_feedback, setInfoFeedback] = useState('');
    const [added_email_feedback, setAddedEmailFeedback] = useState('');

    // Mutation functions to change name, username, email, password & account deletion
    const { data: NameResponse, isSuccess: ChangeNameResponse, isError: ChangeNameIssue, error: ChangeNameIssueResponse, mutate: ChangeName } = CHANGE_NAME(props.csrf);
    const { data: UserResponse, isSuccess: ChangeUsernameResponse, isError: ChangeUserIssue, error: ChangeUserIssueResponse, mutate: ChangeUsername } = CHANGE_USERNAME(props.csrf);
    const { isError: AddNewEmailIssue, error: AddNewEmailIssueResponse, mutate: AddedEmail } = ADD_OR_CHANGE_EMAIL(props.csrf); // for old user who dont have an email
    const { data: EmailResponse, isSuccess: ChangeEmailResponse, isError: ChangeEmailIssue, error: ChangeEmailIssueResponse, mutate: ChangeEmail } = ADD_OR_CHANGE_EMAIL(props.csrf);
    const { data: ChangePassResponse, status: ChangePassStatus, error: ChangePassIssue, mutate: ChangePassword } = CHANGE_PASSWORD(props.csrf);
    const { error: AccountDeletionIssue, mutate: AccountDeletion, isSuccess } = ACCOUNT_DELETION(props.csrf);

    // Handle response to get user data 
    useEffect(() => {
       if (props.UserData) {
          setName(props.UserData.user_data.name);
          setUsername(props.UserData.user_data.username);
          setEmail(props.UserData.user_data.email);
       }
    }, [props.UserData]);

    // Modal for change password & account deletion
    const changePasswordhandleClose = () => setShowPassChange(false);
    const changePasswordhandleShow = () => setShowPassChange(true);
    const deleteAccounthandleClose = () => setShowDeletion(false);
    const deleteAccounthandleShow = () => setShowDeletion(true);

    // Form submission to change user account
    function change_account(e) {
        e.preventDefault();
        setChangeAccountLoading(true);

        const form = e.currentTarget;
        if(form.checkValidity() === false) {
            e.stopPropagation();
            setChangeAccountLoading(false);
        } else {
            // Validation to prevent direct submission
            // Make an API request to change user account
            if (props.UserData.user_data.name !== name) {
                ChangeName({ name: name });
            }
            if (props.UserData.user_data.username !== username) {
                ChangeUsername({ username: username });
            }
            if (props.UserData.user_data.email !== email) {
                ChangeEmail({ email: email });
            }
            if (props.UserData.user_data.email === null && add_email) {
                setTimeout(() => {
                   // Add new email
                   AddedEmail({ email: add_email });
                   setAddedEmailFeedback('Added new email.'); // set message for added email
                }, 800);
            }
            // If no changes were made (email, name, username are the same)
            if (props.UserData.user_data.name === name && props.UserData.user_data.username === username && props.UserData.user_data.email === email) {
                setTimeout(() => {
                    setChangeAccountLoading(false);
                    setInfoFeedback('Fill up your new info.');
                }, 800);

            } 
        }

        setAccountValidated(true);
        setAddedEmailFeedback('');
        setInfoFeedback('');
    }

    // Form submission to change user password
    function change_password(e) {
        e.preventDefault();
        setChangePassLoading(true);

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setChangePassLoading(false);
        } else {
            // Make an API request for changing user password
            ChangePassword({ current_password: current_password, new_password: new_password });
        }
        setChangepassValidated(true);
    }

    // Form submission to delete user account
    function account_deletion(e) {
        e.preventDefault();
        setAccountDeletionLoading(true);

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setAccountDeletionLoading(false);
        } else {
            // Make an API request for deleting user account
            AccountDeletion({ password: deletion_password });
        }
        setDeletionValidated(true);
    }

    // Handle mutation response for change account
    useEffect(() => {
        if (ChangeNameIssue || ChangeUserIssue || ChangeEmailIssue || ChangeNameResponse || ChangeUsernameResponse || ChangeEmailResponse) {
            setChangeAccountLoading(false);
        }
    }, [ChangeNameIssue, ChangeUserIssue, ChangeEmailIssue, ChangeNameResponse, ChangeUsernameResponse, ChangeEmailResponse]);

    // Handle mutation response for change password
    useEffect(() => {
        if (ChangePassIssue) {
            setChangePassLoading(false);
        }
    }, [ChangePassIssue]);

    // Handle mutation response for account deletion
    useEffect(() => {
        if (AccountDeletionIssue) {
            setAccountDeletionLoading(false);
        }
    }, [AccountDeletionIssue]);

    // Request response when changing an account
    function Response() {
        return (
            <div>
               
                {
                  added_email_feedback ? 
                    <p style={{ textAlign: 'center', color: AddNewEmailIssue ? 'red' : 'lightgreen' }}>
                       {AddNewEmailIssueResponse?.response?.data.email || added_email_feedback}
                    </p>
                    :
                    <p style={{ textAlign: 'center', color: 'lightblue' }}>
                       {info_feedback}
                    </p>
                }
                <p style={{ textAlign: 'center', color: ChangeNameIssue ? 'red' : 'lightgreen' }}>
                    {ChangeNameIssueResponse?.response?.data?.name || NameResponse?.message}
                </p>
                <p style={{ textAlign: 'center', color: ChangeUserIssue ? 'red' : 'lightgreen' }}>
                    {ChangeUserIssueResponse?.response?.data?.username || UserResponse?.message}
                </p>
                <p style={{ textAlign: 'center', color: ChangeEmailIssue ? 'red' : 'lightgreen' }}>
                    {ChangeEmailIssueResponse?.response?.data?.email || EmailResponse?.message}
                </p>
            </div>
        );
    }

    // Check if success then navigate away as needed
    if (isSuccess) return <Navigate to='/signin' />;

    return (
        <Row className="d-flex align-items-center justify-content-center mt-4">
            <Response />
            <Col md={5}>
                <div className='p-4'>
                    <Form noValidate validated={account_validated} onSubmit={change_account}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ color: 'white' }}>Name</Form.Label>
                            <Form.Control
                                type="name"
                                className='custom-input'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label style={{ color: 'white' }}>Username</Form.Label>
                            <Form.Control
                                type="username"
                                className='custom-input'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                            <Form.Control
                                type="email"
                                className='custom-input'
                                value={email || add_email}
                                onChange={props.UserData?.user_data?.email === null ? (e) => setAddEmail(e.target.value) : (e) => setEmail(e.target.value)}
                                placeholder={props.UserData?.user_data?.email === null ? 'Add new email' : null}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please choose a email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading_change_account}>
                                {loading_change_account ? 'Submitting...' : 'Submit'}
                            </button>

                            <Button variant="secondary" onClick={changePasswordhandleShow}>
                                Change password
                            </Button>
                        </div>

                        <div className="mt-3">
                            <Button variant="danger" onClick={deleteAccounthandleShow}>Delete account</Button>
                        </div>
                    </Form>

                    <Modal
                        show={show_pass_change}
                        onHide={changePasswordhandleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Body style={{ background: '#333' }}>
                            {ChangePassStatus === 'success'
                                ? <p style={{ color: 'lightgreen', textAlign: 'center' }}>{ChangePassResponse?.message}</p>
                                : <p style={{ color: 'red', textAlign: 'center' }}>{(ChangePassIssue?.response?.data?.new_password || ChangePassIssue?.response?.data?.message)}</p>
                            }
                            <Form noValidate validated={changepass_validated} onSubmit={change_password}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                    <Form.Label style={{ color: 'white' }}>Current password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        className='custom-input'
                                        value={current_password}
                                        onChange={(e) => setCurrentpassword(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Provide your password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                    <Form.Label style={{ color: 'white' }}>New password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        className='custom-input'
                                        value={new_password}
                                        onChange={(e) => setNewpassword(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <Button variant="secondary" onClick={changePasswordhandleClose}>Cancel</Button>
                                    <Button variant="primary" type="submit" disabled={loading_change_pass}>
                                        {loading_change_pass ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal
                        show={show_deletion}
                        onHide={deleteAccounthandleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Body style={{ background: '#333' }}>
                            <p style={{ color: 'red', textAlign: 'center' }}>Your account might permanently be deleted along with your messages.</p>
                            <p style={{ color: 'red', textAlign: 'center' }}>{AccountDeletionIssue?.response?.data?.message}</p>
                            <Form noValidate validated={deletion_validated} onSubmit={account_deletion}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                    <Form.Label style={{ color: 'white' }}>Confirm password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        className='custom-input'
                                        value={deletion_password}
                                        onChange={(e) => setDeletionpassword(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Provide your password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <Button variant="secondary" onClick={deleteAccounthandleClose}>Cancel</Button>
                                    <Button variant="danger" type="submit" disabled={loading_account_deletion}>
                                        {loading_account_deletion ? 'Confirming...' : 'Confirm'}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            </Col>
        </Row>
    );
}
