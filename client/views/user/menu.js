Template.userMenu.helpers({
  is3DPrintActive: function() {
    var cssClass = Template.instance().data.menuItem === '3D Print' || false;
    return cssClass ? 'active' : '';
  },
  isPrintRoomActive: function() {
    var cssClass = Template.instance().data.menuItem === 'Print Room' || false;
    return cssClass ? 'active' : '';
  }
});
