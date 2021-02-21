import * as actionTypes from './actions';
import {updateObject} from '../shared/utility';

const intialState = {
    eventName: '',
    amountPeople: '',
    currentPage: 0,
    subtotal: 0,
    items: [],
    persons: []
};

const reducer = (state = intialState, action) => {
    switch (action.type) {
        case actionTypes.EVENT_NAME_CHANGED:
            return updateObject(state, {eventName: action.event.target.value});
        case actionTypes.AMOUNT_PEOPLE_CHANGED:
            return updateObject(state, {amountPeople: parseInt(action.event.target.value)});
        case actionTypes.ON_START:
            let initialPersons = []
            //create person objects = to amountPeople & push to array
            for (let i = 0; i < state.amountPeople; i++) {
                initialPersons.push({
                    name: i,
                    items: []
                });
            }
            //set persons state to created array
            return updateObject(state, {
                currentPage: state.currentPage + 1,
                persons: initialPersons
            });
        case actionTypes.NEXT_PAGE:
            return updateObject(state, {
                currentPage: state.currentPage + 1
            });
        case actionTypes.ADD_ITEM:
            //updatedItems = copy of items + new item
            let updatedItems = state.items.concat({
                name: action.name,
                price: parseFloat(action.price),
                persons: [],
                taxed: false
            });
            //update price
            let updatedPrice = state.subtotal + parseFloat(action.price);
            //update state
            return updateObject(state, {
                items: updatedItems,
                subtotal: updatedPrice
            });
        case actionTypes.REMOVE_ITEM:
            //update subtotal
            let updatedSubtotal = state.subtotal - state.items[action.id].price
            //update items excluding removed item & update subtotal object
            return updateObject(state, {
                items: state.items.filter((_, i) => i !== action.id),
                subtotal: updatedSubtotal
            });
        case actionTypes.GO_BACK:
            return updateObject(state, {currentPage: state.currentPage - 1});
        case actionTypes.CHANGE_NAME:
            //update person object
            let updatedPerson = updateObject(state.persons[action.id], {name: action.event.target.value});
            //update persons array by replacing w/ new person object
            let updatedPersons = [...state.persons];
            updatedPersons[action.id] = updatedPerson;
            //set state persons to updated persons array
            return updateObject(state, {persons: updatedPersons});
        case actionTypes.ADD_PERSON:
            //add to amount of people
            let updatedAmountPeople = state.amountPeople + 1;
            //add person object to persons array
            let AddedToPersons = state.persons.concat({
                name: state.amountPeople,
                items: []
            });
            //update states
            return updateObject(state, {
                amountPeople: updatedAmountPeople,
                persons: AddedToPersons
            });
        case actionTypes.REMOVE_PERSON:
            //subtract from amount of people
            let updatedAmtPeople = state.amountPeople - 1;
            //update persons excluding removed person
            return updateObject(state, {
                amountPeople: updatedAmtPeople,
                persons: state.persons.filter((_, i) => i !== action.id)
            });
        case actionTypes.CLAIM_ITEM:
            let updatePersons = [...state.persons];
            let updateItems = [...state.items];
            //if person hasn't claimed item yet, add to lists
            if(!state.persons[action.personId].items.includes(state.items[action.itemId].name)) {
                //add item to person.items array - persons[1].items
                let personItems = state.persons[action.personId].items.concat(state.items[action.itemId].name);
                //update person object - persons[1]
                let updatePerson = updateObject(state.persons[action.personId], {items: personItems});
                //update persons array by replacing w/ new person object - persons
                updatePersons[action.personId] = updatePerson;

                //add person to items.persons array - items[1].persons
                let itemClaimers = state.items[action.itemId].persons.concat(state.persons[action.personId].name);
                //update item object - items[1]
                let updateItem = updateObject(state.items[action.itemId], {persons: itemClaimers});
                //update items array by replacing w/ new item object - items
                updateItems[action.itemId] = updateItem;
            }
        // case actionTypes.TAX_ITEM:
            // let currentItems = [...state.items];

            // updateItems[action.itemId] = updateItem;
            //if person already claimed item, remove from lists
            else {
                console.log('here');
                //remove item from person.items array
                let personItems = state.persons[action.personId].items.filter((item) => item !== state.items[action.itemId].name);
                //update person object
                let updatePerson = updateObject(state.persons[action.personId], {items: personItems});
                //update persons array by replacing w/ new person object
                let updatePersons = [...state.persons];
                updatePersons[action.personId] = updatePerson;
                
                //remove person from items.claimers array
                let itemClaimers = state.items[action.itemId].persons.filter((person) => person !== state.persons[action.personId].name);
                //update item object
                let updateItem = updateObject(state.items[action.itemId], {persons: itemClaimers});
                //update items array by replacing w/ new item object
                let updateItems = [...state.items];
                updateItems[action.itemId] = updateItem;
            }

            console.log(updateItems);

            //set state persons to updated persons array & items to updated items array
            return updateObject(state, {
                persons: updatePersons,
                items: updateItems
            });
        default:
            return state;
    }
};

export default reducer;