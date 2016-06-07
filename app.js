function updateContactList(){
  cozysdk.defineRequest('Contact', 'all', 'function(doc){ emit(doc.n); }', function(err, res) {
    if (err != null) return alert(err);
    cozysdk.run('Contact', 'all', {}, function(err, res) {
      if (err != null) return alert(err);
      var contacts = JSON.parse(JSON.stringify(res));
      /* contacts == [
        {id:"323274828329", key:"Jane;Willson"},
        {id:"323274827428", key:"John;Smith"}
      ]*/
      render(contacts);
    });
  });
}

function render(contacts) {
	var i;
	var HTML = '';
	for (i = 0; i < contacts.length; i++) {
		var template = '<tr data-id="' + contacts[i].id + '">'
		+ '<td><input value="' + contacts[i].key + '"" class="edit"></td>'
		+ '<td><input type="button" class="update" value="Update"></td>'
		+ '<td><input type="button" class="destroy" value="Destroy"></td>'
		+ '</tr>';
		HTML = HTML + template;
	}
	document.querySelector('.contact-list').innerHTML = HTML;
}


function onSendChanged(){
  var contactName = document.querySelector('.send').value.trim();
  var values = {n: contactName};
  cozysdk.create('Contact', values, function(err, res) {
    if (err != null) return alert(err);
    // res.id == "8239283928326"
    document.querySelector('.send').value = '';
    updateContactList();
  });
}


document.querySelector('.send').addEventListener('change', onSendChanged);
document.addEventListener("DOMContentLoaded", updateContactList);
