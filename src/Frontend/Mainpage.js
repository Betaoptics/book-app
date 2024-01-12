import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form, Alert} from 'react-bootstrap';
// import '../css/bookCatalog.css';
import '../css/bootstrap-custom.css';

function Mainpage() {

    const [book, setBook] = useState([]);
    const [id, setID] = useState();
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [edited, IsEdited] = useState(true);
    const [state, setState] = useState(false)
    const [message, setMessage] = useState({
        error: false,
        message: '',
    });

    
    // Initialize request params
    const BACKENDPORT = 3500;
    const multiple_books_url = `http://localhost:${BACKENDPORT}/catalog/books`;
    const individual_book_url = `http://localhost:${BACKENDPORT}/catalog/book/${id}`;

    const GET_request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    const CREATE_BODY = {
        author: author,
        title: title,
        description: description
    };
    
    const CREATE_req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CREATE_BODY)
    };

    const PATCH_BODY = {
        _id: id,
        author: author,
        title: title,
        description: description
    };
    
    const PATCH_req = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(PATCH_BODY)
    };
    
    const DELETE_BODY = {
        _id: id
    }

    const DELETE_req = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(DELETE_BODY)
    };

    // Check for edit status flag. Used to enable/disable Save & Delete buttons.
    useEffect(() => {
        // Check id exists. If any inputfield has content, enable button. Otherwise disable them.
        if(id !== undefined || author.length === 0 || title.length === 0 || description.length === 0) {
            if(author.length > 0 || title.length > 0 || description.length > 0) {
                IsEdited(true);
            } else {
                IsEdited(false);
            }
        } else {
            IsEdited(false)
        }
    }, [id, author, title, description]);

    // GET request for initial fetch of book data from server.
    useEffect(() => {
        try {
        fetch(multiple_books_url, GET_request)
            .then((res) => res.json())
            .then((book) => {
                 // Check book data exists. Set book data & change loading status to false.
                if(book !== null || book !== undefined) {
                    setBook(book);
                    setIsLoading(false);
                } else {
                    setMessage({error: true, message: 'Error! Data not found!'});
                }
            })
        } catch (error) {
            setMessage({error: true, message: `Error! ${error.toString()}`});
        }
    }, []);

    // Make a GET request for books list whenever [state] flag is called.
    useEffect(() => {
        try {
        fetch(multiple_books_url, GET_request)
            .then((res) => res.json())
            .then((book) => {
                 // Check book data exists. Set book data & change loading status to false.
                if(book !== null || book !== undefined) {
                    setBook(book);
                    setIsLoading(false);
                } else {
                    setMessage({error: true, message: 'Error! Data not found!'});
                }
            })
        } catch (err) {
            setMessage({error: true, message: 'Error! Data not found!'});
        }
    }, [state]);

    // Fetch id from data and store the data.
    const getID = (book) => {
        setID(book._id);
    }

    // Make a GET request for individual book data whenever [id] flag is called.
    useEffect(() => {
        // If id is not found, shortcircuit.
        if(id === undefined) return;
        try {
        fetch(individual_book_url, GET_request)
            .then((res) => res.json())
            .then((book) => {
                // Check book data exists. Populate the rest of the fields of data.
                if(book !== null || book !== undefined) {
                    setAuthor(book.author);
                    setTitle(book.title);
                    setDescription(book.description);
                } else {
                    setMessage({error: true, message: 'Error! Data not found!'});
                }
            })
        } catch (error) {
            setMessage({error: true, message: `Error! ${error.toString()}`});
        }
    }, [id]);

// Create new book with POST request.
const handleCreate = () => {
    fetch(multiple_books_url, CREATE_req)
    .then(async response => {
        // Check if data is in JSON format.
        const isJSON = response.headers.get('content-type')?.includes('application/json');
        const book = isJSON && await response.json();
       

        // If everything went as expected.
		if(book && (response.ok || response.status === 200 || response.status === 201)) {
            setState(!state);
            setMessage({error: false, message: 'Success! New book was created.'});
            setAuthor('');
            setTitle('');
            setDescription('');
        }
    })
    .catch(error => {
        setMessage({error: true, message: `Error! ${error.toString()}`});
    })
}

// Update book data with PATCH request.
const onSave = () => {
    if(!isLoading) {
        fetch(individual_book_url, PATCH_req)
        .then(async response => {
            // Check if data is in JSON format.
            const isJSON = response.headers.get('content-type')?.includes('application/json');
            const book = isJSON && await response.json();

           // If everything went as expected.
            if(book && (response.ok || response.status === 200 || response.status === 201)) {
                setState(!state);
                setMessage({error: false, message: 'Success! New book was created.'});
                setAuthor('');
                setTitle('');
                setDescription('');
            }
        })
        .catch(error => {
            setMessage({error: true, message: `Error! ${error.toString()}`});
        })
        
    }

}

// Delete a book with DELETE request.
const onDelete = () => {
    if(!isLoading) {
        fetch(individual_book_url, DELETE_req)
        .then(async response => {

            // If everything went as expected
            if(response.ok) {
                const book = response;
                setState(!state);
                setAuthor('');
                setTitle('');
                setDescription('');
                setMessage({error: false, message: 'Success!'});
                return book;
            }

            if(!response.ok || response.status !== 200) {
                const error = (book && book.message) || response.status;
                setMessage({error: true, message: `Error! ${error}`});
                return Promise.reject(error);
            }
        })
        
        .catch(error => {
            setMessage({error: true, message: `Error! ${error.toString()}`});
        })
    }
}

// Automatically dismiss alerts after a period of time.
useEffect(() => {
    const timer = setTimeout(() => {
        setMessage({error: false, message: ''});
    }, 4000);
    return () => clearTimeout(timer);
}, [message]);

const AlertMessages = () => {
    if(message.error === true) {
        return (<Alert variant="danger" dismissible >{message.message}</Alert>);
    } else if (message.message !== '') {
        return (<Alert variant="success" dismissible >{message.message}</Alert>);
    } else {
        return null;
    }
}

    const BookForm = () => {
        if(!isLoading) {
            return (
                <div>
                    {AlertMessages()}
                    <Form>
                        <Form.Group>
                        <Form.Label className="label-padding">Author</Form.Label>
                            <Form.Control type="text" placeholder='Placeholder' value={author} onChange={(e) => setAuthor(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label-padding">Title</Form.Label>
                            <Form.Control type="text" placeholder='Placeholder' value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group id="form-group-padding">
                            <Form.Label className="label-padding">Description</Form.Label>
                            <Form.Control as="textarea" rows={10} placeholder='Placeholder' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                            </Form.Group>
                        <Form.Group>
                            <div>
                                <Button variant="primary" onClick={() => {handleCreate()}}>Save new</Button>{' '}
                                <Button value={edited} variant={edited? "primary": "secondary"} disabled={edited? false : true} onClick={() => {onSave()}}>Save</Button>{' '}
                                <Button value={edited} 
                                // variant="danger" 
                                variant={edited? "danger": "secondary"} 
                                disabled={edited? false : true} onClick={() => {onDelete()}}>Delete</Button>{' '}
                            </div>
                        </Form.Group>
                   </Form>
                </div>
            )
        } else {
            return (<><p>Not loaded!</p></>)
        }
    }

    return (
        <div id="div-margin">
            <Row className="row-alignment" xs={6} md={6} lg={6} sm={6}>
                <Col><h1>Book Catalog</h1></Col>
            </Row>
            <Row className="row-alignment" xs={3} md={3} lg={3} sm={3}>
                <Col>
                    <Card key="bookControls" className="card-props">
                        <Card.Body className="card-props">
                            {BookForm()}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card key="books" className="card-props">
                        <Card.Body className="card-props">              
                            {book.map((book, index) => {
                                return (
                                    <div key={`div-${book._id}`}>
                                        <Button key={`button-${book._id}-${index}`} variant="primary" id='btn-props'onClick={() => {getID(book)}}>
                                                <p id="p-props" key={`booklist-${book._id}-${index}`} value={book}>{book.title}</p>
                                        </Button>      
                                    </div>
                                )
                            })}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        );
    }

export default Mainpage;