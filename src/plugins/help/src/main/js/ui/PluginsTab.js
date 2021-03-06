define(
'tinymce.plugins.help.ui.PluginsTab',
  [
    'tinymce.core.EditorManager',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Strings',
    'tinymce.plugins.help.data.PluginUrls'
  ],
function (tinymce, Obj, Arr, Fun, Strings, PluginUrls) {
  var maybeUrlize = function (name) {
    return Arr.find(PluginUrls.urls, function (x) {
      return x === name;
    }).fold(Fun.constant(name), function (pluginName) {
      return Strings.supplant('<a href="${url}" target="_blank">${name}</a>', {
        name: pluginName,
        url: 'https://www.tinymce.com/docs/plugins/' + pluginName
      });
    });
  };

  var getPluginKeys = function (editor) {
    var keys = Obj.keys(editor.plugins);
    return editor.settings.forced_plugins === undefined ?
      keys :
      Arr.filter(keys, Fun.not(Fun.curry(Arr.contains, editor.settings.forced_plugins)));
  };

  var pluginLister = function (editor) {
    var pluginKeys = getPluginKeys(editor);
    var pluginLis = Arr.map(pluginKeys, function (key) {
      return '<li>' + maybeUrlize(key) + '</li>';
    });
    var count = pluginLis.length;
    var pluginsString = pluginLis.join('');

    return '<p><b>Plugins installed (' + count + '):</b></p>' +
            '<ul>' + pluginsString + '</ul>';
  };

  var installedPlugins = function (editor) {
    return {
      type: 'container',
      html: '<div style="overflow-y: auto; overflow-x: hidden; max-height: 230px; height: 230px;" data-mce-tabstop="1" tabindex="-1">' +
              pluginLister(editor) +
            '</div>',
      flex: 1
    };
  };

  var availablePlugins = function () {
    return {
      type: 'container',
      html: '<div style="padding: 10px; background: #e3e7f4; height: 100%;" data-mce-tabstop="1" tabindex="-1">' +
              '<p><b>Premium plugins:</b></p>' +
              '<ul>' +
                '<li>PowerPaste</li>' +
                '<li>Spell Checker Pro</li>' +
                '<li>Accessibility Checker</li>' +
                '<li>Advanced Code Editor</li>' +
                '<li>Enhanced Media Embed</li>' +
                '<li>Link Checker</li>' +
              '</ul><br />' +
              '<p style="float: right;"><a href="https://www.tinymce.com/pricing/" target="_blank">Learn more...</a></p>' +
            '</div>',
      flex: 1
    };
  };

  var makeTab = function (editor) {
    return {
      title: 'Plugins',
      type: 'container',
      style: 'overflow-y: auto; overflow-x: hidden;',
      layout: 'flex',
      padding: 10,
      spacing: 10,
      items: [
        installedPlugins(editor),
        availablePlugins()
      ]
    };
  };

  return {
    makeTab: makeTab
  };
});
