VK.init({
    apiId: 7045020
});

const authButton = document.querySelector('.authorization-button');

const closeButton = document.querySelector('.close-button');

function closeButtonAction() {
    VK.Auth.logout(function () {
        location.reload();
    });
}

let userInfoBuff = "";

VK.Auth.getLoginStatus(function (response) {
    if (response.session) {
        getUser();
        getFriends();
        closeButton.style.display = "block";
    }
    else {
        authButton.style.display = "block";
        closeButton.style.display = "none";
    }
});

function getUser() {
    VK.Api.call('users.get', {
        v: '5.101'
    }, function (data) {
        let user = data.response[0];
        userInfoBuff = user.first_name + " " + user.last_name;
    });
}

const userInfo = document.querySelector('.user_info');

function authButtonAction() {
    VK.Auth.login(function (response) {
        if (response.session && response.session.user) {
            let user = response.session.user;
            userInfoBuff = user.first_name + " " + user.last_name;
            authButton.style.display = "none";
            closeButton.style.display = "block";
            getFriends();
        }
    }, VK.access.FRIENDS);

}

function getFriends() {
    VK.Api.call('friends.get', {
        fields: 'photo_rec',
        count: 5,
        v: '5.101'
    }, function (data) {
        if (data.response) {
            let photos = [];
            if (data.response.count > 0) {
                for (let friend of data.response.items) {
                    if (friend.photo_rec && friend.photo_rec.indexOf('images/question_c.gif') == -1) {
                        photos.push({
                            photo: friend.photo_rec,
                            id: friend.id
                        });
                    }
                }
            }
            initField(photos);
        }
    });
}

function makeElement(tagType, className) {
    let newElement = document.createElement(tagType);
    newElement.className = className;
    return newElement;
}

function createPhoto(data, photoContainer) {
    for (let item of data) {
        let photoLink = makeElement('a', 'photo');
        let photoImg = makeElement('img', 'photo_img');
        photoImg.src = "" + item.photo;
        photoLink.href = "https://vk.com/id" + item.id;
        photoLink.target = "_blank";
        photoLink.appendChild(photoImg);
        photoContainer.appendChild(photoLink);
    }
}

function initField(photos) {
    userInfo.innerText = userInfoBuff;
    const photoContainer = document.querySelector('.photo-container');
    createPhoto(photos, photoContainer);
}


