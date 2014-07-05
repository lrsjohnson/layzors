// Inherits from MapView
var EditorView = function() {
    MapView.call(this);
};
EditorView.prototype = Object.create(MapView.prototype);
EditorView.prototype.constructor = MapView;

EditorView.prototype.handleClick = function(e) {
    var offset = $(this.canvas).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    var xCell = Math.floor(x / this.cellWidth);
    var yCell = Math.floor(y / this.cellHeight);
    var pos = create_position(xCell, yCell);
    this.cellClickDelegate(pos);
};

EditorView.prototype.init = function(map, canvas) {
    MapView.prototype.init.call(this, map, canvas);
    $(this.canvas).click(_.bind(this.handleClick, this));
};

EditorView.prototype.registerCellClickDelegate = function(delegate) {
    this.cellClickDelegate = delegate;
};