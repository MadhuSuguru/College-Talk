export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].username : users[0].username;
}

export const getSenderObject = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSameSender = (messages, msg, i, userId) => {
    return (
        (i+1< messages.length) && ((messages[i + 1].sender._id !== msg.sender._id || messages[i+1].sender._id === undefined) && messages[i].sender._id !== userId)
    )
}

export const isLastMessage = (messages, i, userId) => {
    const n = messages.length;
    return (
        (i===n-1) && messages[n-1].sender._id !==userId
    )
}

export const isSameSenderMargin = (messages, msg, i, userId) => {
    const n = messages.length;

    if ((i + 1 < n) && messages[i + 1].sender._id !== msg.sender._id && messages[i].sender._id !== userId || (i === n-1 && messages[i].sender._id !== userId)) {
        return 0;
    }
    else if ((i + 1 < n) && (messages[i + 1].sender._id === msg.sender._id && messages[i].sender._id !== userId)) {
        return 33; 
    }
    else return "auto";
}