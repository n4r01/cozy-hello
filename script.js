
/*global localforage*/
/*jslint devel: true*/
/*jslint plusplus: true*/
(function () {
    'use strict';
    var contactStore = localforage.createInstance({name: 'contacts'});

    function render(contacts) {
        var i, HTML, template, contact;
        HTML = '';
        for (i = 0; i < contacts.length; i++) {
            contact = contacts[i];
            template = '<tr data-key="' + contact.key + '">'
                + '<td><input value="' + contact.n + '"" class="edit"></td>'
                + '<td><input type="button" class="update" value="Update"></td>'
                + '<td><input type="button" class="destroy" value="Destroy"></td>'
                + '</tr>';
            HTML = HTML + template;
        }
        document.querySelector('.contact-list').innerHTML = HTML;
    }

    function updateContactList() {
        var contacts = [];
        cozysdk.defineRequest('Contact', 'all', 'function(doc) { emit(doc.n); }', function(err, res) {
		if (err != null) {
			return alert(err);
		} else {
			cozysdk.run('Contact', 'all', {}, function(err, res) {
				if (err != null) {
					return alert(err);
				} else {
					res.forEach(function(contact) {
						contact.key = contact.key.replace(/ /g, '\u00a0');
                        console.log(contact);
                        contacts.push(contact);
					});
				}
			});
		}
	});
        contactStore.iterate((contact, contactKey, indice) => {
            contacts.push(JSON.parse(contact));
        }).then(() => {
            render(contacts);
        }).catch(err => {
            alert(err);
        });
    }

    function onSendChanged() {
        var contactName, trimName, contact;
        contactName = document.querySelector('.send').value;
        trimName = contactName.trim();
        if (trimName === '')
            return;
        contact = {
            key: trimName.replace(/\W/, '_').toLowerCase(),
            n: trimName
        };
        contactStore.setItem(contact.key, JSON.stringify(contact)).then(value => {
            document.querySelector('.send').value = '';
            updateContactList();
        }).catch(err => {
            alert(err);
        });
    }

    function getKeyFromElement(element) {
        if (element.parentNode.dataset.key) {
            console.log(element.parentNode.dataset.key);
            return element.parentNode.dataset.key;
        }
        return getKeyFromElement(element.parentNode);
    }

    function onButtonDestroyClicked(event) {
        contactStore.removeItem(getKeyFromElement(event.target)).then(() => {
            updateContactList();
        }).catch(err => {
            alert(err);
        });
    }

    function attachEventHandler(klass, action, listener) {
        var useCapture = action === 'blur';
        document.querySelector('.contact-list').addEventListener(action, function(event) {
            if (event.target.matches(klass)) {
                listener.call(event.target, event);
            }
        }, !!useCapture);
    }

    function onUpdatePressed(event) {
        var contact = {
            n: event.target.value.trim()
        };

        cozysdk.updateAttributes('Contact', getIDFromElement(event.target), contact, function(err, res) {
            if (err) {
                return alert(err);
            } else {
                updateContactList();
            }
        });
    }

    function onUpdateKeyPressed(event) {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }

    function onButtonSyncClicked(event) {
        console.log('toto');
        contactStore.iterate((contact, contactKey, indice) => {
            cozysdk.create('Contact', JSON.parse(contact), function(err, obj){
                console.log(obj.id)
            })
        })
    }

    function initialize() {
        //contactStore.clear();
        document.querySelector('.send').addEventListener('change', onSendChanged);
        attachEventHandler('table .edit', 'blur', onUpdatePressed);
        attachEventHandler('table .edit', 'keypress', onUpdateKeyPressed);
        attachEventHandler('.destroy', 'click', onButtonDestroyClicked);
        document.querySelector('.sync').addEventListener('click', onButtonSyncClicked);
        updateContactList();
    }

    document.addEventListener("DOMContentLoaded", initialize);
})();
