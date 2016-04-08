/* global jQuery */
(function ($) {
    
    /**
     * Finds if element has overflow-x or overflow-y set
     * @param  {any} el
     */
    function hasOverflow(el) {
        var computedStyle = window.getComputedStyle(el, null),
            overflowX = computedStyle.getPropertyValue('overflow-x'),
            overflowY = computedStyle.getPropertyValue('overflow-y');
            
        return {
            x: overflowX === 'auto' || overflowX === 'scroll',
            y: overflowY === 'auto' || overflowY === 'scroll'
        }
    }
    
    /**
     * Finds parent element whith scroll
     * @param  {any} el
     * @param  {any} direction - `x` or `y`
     */
    function findScrollingParent(el, direction) {
        var parent = el;
        while (true) {
            parent = parent.parentNode;
            if (!parent.parentNode || parent.parentNode === document) {
                break;
            }
            
            if (direction === 'x') {
                if (parent.scrollWidth > parent.clientWidth && hasOverflow(parent)['x']) {
                    return parent;
                }
            } else if (direction === 'y') {
                if (parent.scrollHeight > parent.clientHeight && hasOverflow(parent)['y']) {
                    return parent;
                }
            } else {
                throw 'Direction parameter missing';
            }
        }
    }
    
    $.fn.fixedTableHeader = function () {
        return this.each(function () {
            var self                    = $(this);
            var theadElem               = self.find('thead');
            var scrollingParentX        = $(findScrollingParent(self.get(0), 'x'));
            var scrollingParentY        = $(findScrollingParent(self.get(0), 'y'));
            
            var theadElemCloneContainer = $('<table></table>')
                .appendTo(self.parent())
                .addClass(self.attr('class'))
                .width(scrollingParentX.length ? scrollingParentX.width() : self.width())
                .height(theadElem.height())
                .css({
                    overflow: 'hidden',
                    display: 'none',
                    position: 'fixed'
                });
                
            var theadElemClone = theadElem.clone(true)
                .appendTo(theadElemCloneContainer)
                .width(theadElem.width())
                .css({
                    position: 'absolute'
                });
            
            // Get old data
            var oldData = self.data('fixedTableHeader');
            
            // Set data
            self.data('fixedTableHeader', {
                theadElemCloneContainer: theadElemCloneContainer
            });
            
            // Redraw
            if (oldData) {
                oldData.theadElemCloneContainer.remove();
                updateTopPosition();
                updateLeftPosition();
            }
            
            // Set clone td widths same as original one's
            theadElem.children('tr').each(function (rowIndex) {
                var originalRow = $(this),
                    clonedRow = theadElemClone.children('tr').eq(rowIndex);
                    
                originalRow.children('td').each(function (cellIndex) {
                    var originalCell = $(this),
                        clonedCell = clonedRow.children('td').eq(cellIndex);
                        
                    clonedCell.width(originalCell.width());
                });
            });
            
            /**
             * Update `top` position of fixed plugin table element
             */
            function updateTopPosition() {
                var scrollingParentOffsetTop = scrollingParentY.offset().top;
                var distanceFromParent = self.offset().top - scrollingParentOffsetTop;
                
                if (distanceFromParent < 0) {
                    theadElemCloneContainer.css('top', scrollingParentOffsetTop);
                    theadElemCloneContainer.show();
                } else {
                    theadElemCloneContainer.hide();
                }
            }
            
            /**
             * Update `left` position of fixed plugin table element
             */
            function updateLeftPosition() {
                var scrollLeft = scrollingParentX.scrollLeft();
                theadElemClone.css('left', - scrollLeft);
            }
            
            // Listen for scroll events
            scrollingParentY.on('scroll', updateTopPosition);
            scrollingParentX.on('scroll', updateLeftPosition);
        });
    };
    
})(jQuery);