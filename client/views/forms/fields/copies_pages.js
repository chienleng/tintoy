Template.copiesPages.helpers({
  paperSizes: function() {
    return _.map(PaperSizes, function(size) {
      size.label === 'A4' ? size.selected = 'selected' : size.selected = '';
      return size;
    });
  }
});
