Ext.application({
    name : 'Combobox Select All Option Example',

    launch : function() {
        Ext.create('Ext.form.Panel', {
            items: [
                {
                xtype: 'combobox',
                fieldLabel: 'States',
                multiSelect: true,
                plugins: ['comboboxSelectAll'],
                name: 'estados',
                width: 400,
                store: Ext.create('Ext.data.ArrayStore', {
                    fields: ['codigo', 'estado'],
                    data: [[31, 'MG'], [11, 'SP'], [21, 'RJ'], [61, 'DF']]
                }),
                valueField: 'codigo',
                displayField: 'estado',
                queryMode: 'local',
                emptyText: 'Select states...'
                }
            ],
            renderTo: Ext.getBody()
        });
    }
});

Ext.define('App.plugin.combobox.ComboboxSelectAll', {

    alias: 'plugin.comboboxSelectAll',

	init: function (combo) {

		if(combo.multiSelect) {
			var allSelected = false;
			var id = combo.getId() + '-toolbar-panel';

			Ext.apply(combo, {
				listConfig: {
					tpl : new Ext.XTemplate(
							'<div id="' + id + '"></div><tpl for="."><div class="x-boundlist-item">{' + combo.displayField + '}</div></tpl>'
					)
				}
			});

			var manageSelectAllCheckHandler = function (enable) {
				var selectAllCheck = toolbar.down('#selectAllCheck');
				// Do a handler backup
				var handlerBkp = selectAllCheck.handler;
				// Disable handler
				selectAllCheck.handler = null;
				// Set value
				selectAllCheck.setValue(enable);
				// Enable handler
				selectAllCheck.handler = handlerBkp;
				// Change 'SelectAll' state
				allSelected = enable;
				// Clean memory
				handlerBkp = null;
			};

			var toolbar = Ext.create('Ext.toolbar.Toolbar', {
				items: [{
					xtype: 'checkbox',
					itemId: 'selectAllCheck',
					fieldLabel: 'All',
					labelWidth: 17,
					handler: function(me, evt) {
						if(!allSelected) {
							combo.select(combo.getStore().getRange());
							allSelected = true;
						} else {
							combo.reset();
							allSelected = false;
						}

						if(typeof evt != 'boolean') {
							evt.stopEvent();
						}
					}
				}, '-', {
				    xtype: 'textfield',
					emptyText: 'Search term',
					enableKeyEvents: true,
					listeners: {
						keyup: function(field, e) {
							combo.getStore().clearFilter();
							if(field.getValue()) {
								combo.getStore().filter(combo.displayField, field.getValue());
								manageSelectAllCheckHandler(false);
								field.focus();
							}
						}
					}
				}]
			});

			combo.on({
				select: function (me, records) {
					var len = records.length;
					var store = me.getStore();
					if(len === store.getRange().length && !allSelected) {
						manageSelectAllCheckHandler(true);
					}
				},
				beforedeselect: function (me, record, index) {
					if(allSelected) {
						manageSelectAllCheckHandler(false);
					}
				},
				expand: {
					fn: function() {
					    var selectAllCheck = toolbar.down('#selectAllCheck');
					    var dropdown = Ext.get(id).dom.parentElement;
					    var container = Ext.DomHelper.insertBefore(dropdown, '<div id="' + id + '-container"></div>', true);
					    toolbar.render(container);
						if (combo.value && combo.getStore() && combo.getStore().getRange()) {
						    selectAllCheck.setValue(combo.value.length === combo.getStore().getRange().length);
						}
					},
					single: true
				}
			});
		}
	}

});
