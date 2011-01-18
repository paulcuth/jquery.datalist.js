// HTML5 datalist plugin v.0.1
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php
//
// Enables cross-browser html5 datalist for inputs, by first testing
// for a native implementation before building one.
//
//
// USAGE: 
//$('input[list]').datalist();

/* 
<input type="search" list="suggestions">
<datalist id="suggestions">
  <!--[if !IE]><!-->
  <select><!--<![endif]-->
    <option label="DM" value="Depeche Mode">
    <option label="Moz" value="Morrissey">
    <option label="NO" value="New Order">
    <option label="TC" value="The Cure">
  <!--[if !IE]><!-->
  </select><!--<![endif]-->
</datalist>
*/

$.fn.datalist = function() {
  
  //first test for native placeholder support before continuing
  return ((typeof this[0].list === 'object' ) && this[0].list !== undefined) ? this : this.each(function() {
    //local vars
    var $this = $(this),
        //the main guts of the plugin
        datalist = $('#' + $this.attr('list')),
        opts = datalist.find('option'),
		selected = -1,
		typed = this.value,
		
        
        //wrapper stuffs
        width = $this.width(),
        height = $this.height(),
        ul = $("<ul>", {"class": "datalist", "width": width, "css": 
          {'position': 'absolute', 
           'left': 0, 
           'top': height + 6, 
           'margin': 0, 
           'padding': 0,
           'list-style': 'none',
           'border': '1px solid #ccc', 
           '-moz-box-shadow': '0px 2px 3px #ccc', 
           '-webkit-box-shadow': '0px 2px 3px #ccc', 
           'box-shadow': '0px 2px 3px #ccc', 
           'z-index':99, 
           'background':'#fff', 
           'cursor':'default'}
          }),
        wrapper = $('<div>').css('position', 'relative');
        
    //return this if matching datalist isn't found
    //to be polite if there's any chaining
    if (!datalist.length) {
        return this;
    } else {
    //otherwise, build the structure
      opts.each(function(i, opt) {
        $('<li>').css ({'padding': '0 2px'})
          .append('<span class="value">'+opt.value+'</span>')
          .append('<span class="label" style="float:right">'+opt.label+'</span>')
          .appendTo(ul);
      });
    };
    
	//keyboard access
	$this.keyup (function(e) {
		var value, $visible;
		
		if (e.keyCode == 38 || e.keyCode == 40) {	// Up, Down

			//update selected option
			ul.find('li.selected').removeClass('selected');		
			$visible = ul.find('li:visible');

			selected += e.keyCode - 39;

			if (selected == $visible.length) {
				selected = -1;
			} else if (selected == -2) {
				selected = $visible.length - 1;
			}

			//hightlight selected option and insert value into field
			value = (selected == -1)? typed : $visible.slice(selected, selected + 1).addClass('selected').find('span.value').text();
			$this.attr('value', value);

			e.preventDefault ();

		} else {

			//if value changed, reset selection
			if ((value = $this.attr('value')) != typed) {
				typed = value;
				selected = -1;
				ul.find('li.selected').removeClass('selected');
			}	

			//filter list to only those that match typed value
			ul.find('li').each (function () {
				$(this)[($(this).text().toLowerCase().indexOf ($this.attr('value').toLowerCase ()) == -1)? 'hide' : 'show']();
			});
		}
	});

    //stick the stuff in and hide it
    $this.wrap(wrapper);
    ul.hide().insertAfter($this);
    
    //show it on focus
    $this.focus(function(){
      ul.show(); 
    });
    
    //hide it on blur
    $this.blur(function(){
      ul.hide();
    });
    
    //set value of input to clicked option
    var lis = $this.next().find('li');
    lis.mousedown(function(){
      var value = $(this).find('span.value').text();
      $this.val(value); 
    });
  });
};