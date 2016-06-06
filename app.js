function updateContactList(){
  cozysdk.defineRequest('Contact', 'all', 'function(doc) { emit(doc.n); }', function(err, res) {
    if (err != null) return alert(err);
    cozysdk.run('Contact', 'all', {}, function(err, res) {
      if (err != null) return alert(err);
      var contacts = JSON.parse("" + res);
      /* contacts == [
        {id:"323274828329", key:"Jane;Willson"},
        {id:"323274827428", key:"John;Smith"}
      ]*/
      render(contacts);
    });
  });
}

function render(contacts){
  var HTML = ''
  for (var i = 0; i < contacts.length; i++) {
    HTML += '<tr data-id="' + contacts[i].id + '">' +
          +   '<td><label>' + contacts[i].key + '</label></td>'
          + '</tr>';
  }
  document.querySelector('.contact-list').innerHTML = HTML;
}

document.addEventListener("DOMContentLoaded", updateContactList);
