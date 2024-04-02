import { useState, useEffect } from 'react'
import personsService from './services/persons'

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={type}>
            {message}
        </div>
    )
}

const Filter = ({ filterQuery, handleFilterChange }) => {
    return (
        <div>
            filter shown with: <input value={filterQuery} onChange={handleFilterChange} />
        </div>
    )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({ personsToShow, onDelete }) => {
    return (
        <div>
            {personsToShow.map(person =>
                <div key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => onDelete(person.id)}>delete</button>
                </div>
            )}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterQuery, setFilterQuery] = useState('')
    const [notification, setNotification] = useState({ message: null, type: '' })

    useEffect(() => {
        personsService.getAll().then(response => {
            setPersons(response.data)
        })
    }, [])

    const addPerson = event => {
        event.preventDefault()
        const personObject = { name: newName, number: newNumber }
        const existingPerson = persons.find(p => p.name === newName)
        if (existingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personsService.update(existingPerson.id, personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson.data))
                        setNotification({ message: `Updated ${newName}`, type: 'success' })
                        setTimeout(() => {
                            setNotification({ message: null })
                        }, 5000)
                    })
                    .catch(error => {
                        setNotification({ message: `Information of ${newName} has already been removed from the server`, type: 'error' })
                        setTimeout(() => {
                            setNotification({ message: null })
                        }, 5000)
                    })
            }
        } else {
            personsService.create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson.data))
                    setNewName('')
                    setNewNumber('')
                    setNotification({ message: `Added ${newName}`, type: 'success' })
                    setTimeout(() => {
                        setNotification({ message: null })
                    }, 5000)
                })
        }
    }

    const deletePerson = id => {
        const person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            personsService.remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id))
                })
        }
    }

    const handleNameChange = event => setNewName(event.target.value)
    const handleNumberChange = event => setNewNumber(event.target.value)
    const handleFilterChange = event => setFilterQuery(event.target.value)

    const personsToShow = filterQuery ? persons.filter(person => person.name.toLowerCase().includes(filterQuery.toLowerCase())) : persons

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification.message} type={notification.type} />
            <Filter filterQuery={filterQuery} handleFilterChange={handleFilterChange} />
            <h2>Add a new</h2>
            <PersonForm
                addPerson={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} onDelete={deletePerson} />
        </div>
    )
}

export default App