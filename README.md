brackets-luacheck
=================

A Brackets extension to enable Luacheck support. To install, place in your ```brackets/src/extensions/user``` folder.

You must have luacheck installed and available in the path. The easiest way to do this is to install [Luarocks](https://luarocks.org/), and install luacheck with luarocks.
On Windows, you may also need to adjust your global path environment variable to include the luarocks system tree.

Support for globals is provided from the preferences file, however it is better to use the inline options for luacheck, and a .luacheckrc file in your project root.
