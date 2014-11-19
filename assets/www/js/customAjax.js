var ajaxLocation = "http://easteregg.baademedia.dk/lib/";

function ajax(file, data, callback) {
    alert(file);
    alert(data);
    alert(callback);
    $.ajax({
        url: ajaxLocation+file+".php",
        data: data,
        success: function(result) {
            callback(result);
        }
    });
}