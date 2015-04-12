$(document).ready(function() {
	var canvas = document.getElementById('CI');
	paper.setup(canvas);
	var point = new paper.Point(10, 20);
	var size = new paper.Size();

	$('#add-field').click(function() {
		var fieldName = prompt('Digite o nome do campo');
		$('#custom-fields').append('<div class="row"><div class="col s6 input-field">' +
							'<input type="text" id="' + fieldName + '" placeholder="' + fieldName + '" name="' + fieldName +'">' + 
							'<label for="' + fieldName + '">' + fieldName + '</label>' +
							'</div>' +
							'<div class="col s6 input-field">' +
							'<input type="text" id="description-' + fieldName + '" placeholder="Descrição" name="description-' + fieldName +'">' +
							'</div>' +
							'</div>');
	});
	$('#add-img').click(function() {
		var url = prompt('Digite a URL da imagem');
		$('#images').append('<img src="' + url + '"><br>');
		$('#custom-fields').append('<input type="hidden" name="img[]" value="' + url + '">');
	});
	$('#submit').click(function() {
		$('form').submit();
	});
	$('#pins').on('change', function(e) {
		var val = $(this).val();
		console.log(val);
		size.y = val * 30;
		var rect = new paper.Rectangle(point, size);
		rect.strokeColor = 'black';
		$('#pins-val').text();
		paper.view.update();
	});
	

});

function removeItem(id) {
	$('#' + id).remove();
	Materialize.toast('Item apagado');
}