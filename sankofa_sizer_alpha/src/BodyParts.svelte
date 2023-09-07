<script>
	import { toggle_overlay, box_to_checkbox } from './utils.js';	
	export let handleMouseover;
	const shoulder_to_wrist = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIAogICAgPGRlZnM+CiAgICAgICAgPHBhdGggaWQ9InBhdGgiIGQ9Ik0gMCAwIGMgLTQwIDEwIC0yMCAxMDAgLTcwIDIzOCBsIC0yNSAxNzUiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIvPgogICAgICAgIDxnIGlkPSJzdGFydCI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMCAtMjUgbCAwIDUwIiBzdHlsZT0ic3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDNweDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgMCBsIC0xNSAtMTUgbCAwIDMwIHoiIHN0eWxlPSJzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBmaWxsOiAjMDAwOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSJlbmQiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgLTI1IGwgMCA1MCIgc3R5bGU9InN0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIgLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIDAgbCAxNSAtMTUgbCAwIDMwIHoiIHN0eWxlPSJzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBmaWxsOiAjMDAwOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKICAgICAgICBwYXRoIHtmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kO30KICAgICAgICAudGFwZSB7c3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDIwcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAucmVkdGFwZSB7c3Ryb2tlOiAjZjAwOyBzdHJva2Utd2lkdGg6IDFweDtzdHJva2UtbGluZWNhcDogcm91bmQ7fQogICAgICAgIC5jb2xvciB7c3Ryb2tlOiAjZmZmODZjOyBzdHJva2Utd2lkdGg6IDE2cHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAuY20ge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtZGFzaGFycmF5OiAyIDEwOyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmxpbmUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1kYXNoYXJyYXk6IDggNTsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgIF1dPjwvc3R5bGU+CiAgICAKICAgIDwhLS0gQmFja2dyb3VuZCBpbWFnZSAtLT4KICAgIDxpbWFnZSB4bGluazpocmVmPSIuL3N0YW5kaW5nLmpwZyIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMDAiIGhlaWdodD0iMTUwMCIgLz4KCiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTIwIDM0NikiPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJyZWR0YXBlIj4KICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utd2lkdGgiIGZyb209IjEiIHRvPSI0NTAiIGJlZ2luPSJsb29wLmJlZ2luKzIuNXMiIGR1cj0iMC41cyIgZmlsbD0iZnJlZXplIiAvPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1vcGFjaXR5IiBmcm9tPSIxIiB0bz0iMCIgYmVnaW49Imxvb3AuYmVnaW4rMi43cyIgZHVyPSIwLjNzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgPC91c2U+CiAgICAgICAgPHVzZSB4PSIwIiB5PSIwIiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InRhcGUiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY29sb3IiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY20iLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNzdGFydCIgdHJhbnNmb3JtPSJyb3RhdGUoMTY2KSIgLz4KICAgICAgICA8dXNlIHg9IjQxNSIgeT0iOTUiIHhsaW5rOmhyZWY9IiNlbmQiIHRyYW5zZm9ybT0icm90YXRlKDkwKSIgLz4KICAgIDwvZz4gCgogICAgPCEtLSBIZWxwbGluZXMgLS0+CiAgICA8Zz4KICAgICAgICA8cGF0aCBpZD0ic2hvdWxkZXJsaW5lIiBjbGFzcz0ibGluZSIgZD0iTSAxNTE1IDMyNSBsIDI1IDEwMCI+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGZyb209IjAiIHRvPSIxMyIgZHVyPSIxcyIgcmVwZWF0RHVyPSJpbmRlZmluaXRlIiAvPgogICAgICAgIDwvcGF0aD4KICAgICAgICA8cGF0aCBpZD0id3Jpc3RsaW5lIiBjbGFzcz0ibGluZSIgZD0iTSAxNDA1IDc2MCBsIDg1IDAiPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBmcm9tPSIwIiB0bz0iMTMiIGR1cj0iMXMiIHJlcGVhdER1cj0iaW5kZWZpbml0ZSIgLz4KICAgICAgICA8L3BhdGg+CiAgICA8L2c+CiAgICAKICAgIDwhLS0gdGltaW5nIGxvb3AgLS0+CiAgICA8cmVjdCBoZWlnaHQ9IjEiIHdpZHRoPSIxIiB4PSItMTAiIHk9Ii0xMCI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJ2aXNpYmlsaXR5IiBmcm9tPSJoaWRlIiB0bz0iaGlkZSIgYmVnaW49IjA7bG9vcC5lbmQiIGR1cj0iNHMiIGlkPSJsb29wIiAvPgogICAgPC9yZWN0Pgo8L3N2Zz4K"
	const bicep = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBkPSJNIDAgMCBsIDYzIDIgbSAtMTAwNyAtNzAgbCA1OSAyNSBtIC01NzYgMjUgbCA2OCAwIiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiLz4KICAgICAgICA8ZyBpZD0ic3RhcnQiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgLTI1IGwgMCA1MCIgc3R5bGU9InN0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIgLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIDAgbCAtMTUgLTE1IGwgMCAzMCB6IiBzdHlsZT0ic3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDNweDsgZmlsbDogIzAwMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iZW5kIj4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIC0yNSBsIDAgNTAiIHN0eWxlPSJzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMCAwIGwgMTUgLTE1IGwgMCAzMCB6IiBzdHlsZT0ic3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDNweDsgZmlsbDogIzAwMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgIDwvZz4KICAgIDwvZGVmcz4KICAgIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbCiAgICAgICAgcGF0aCB7ZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDt9CiAgICAgICAgLnRhcGUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAyMHB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLnJlZHRhcGUge3N0cm9rZTogI2YwMDsgc3Ryb2tlLXdpZHRoOiAxcHg7c3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgICAgICAuY29sb3Ige3N0cm9rZTogI2ZmZjg2Yzsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmNtIHtzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogMTZweDsgc3Ryb2tlLWRhc2hhcnJheTogMiAxMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7fQogICAgXV0+PC9zdHlsZT4KICAgIAogICAgPCEtLSBCYWNrZ3JvdW5kIGltYWdlIC0tPgogICAgPGltYWdlIHhsaW5rOmhyZWY9Ii4vc3RhbmRpbmcuanBnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIxNTAwIiAvPgoKICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3NTAgNDgwKSI+CiAgICAgICAgPHVzZSB4PSIwIiB5PSIwIiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InJlZHRhcGUiPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS13aWR0aCIgZnJvbT0iMSIgdG89IjQ1MCIgYmVnaW49Imxvb3AuYmVnaW4rMi41cyIgZHVyPSIwLjVzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBiZWdpbj0ibG9vcC5iZWdpbisyLjdzIiBkdXI9IjAuM3MiIGZpbGw9ImZyZWV6ZSIgLz4KICAgICAgICA8L3VzZT4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0idGFwZSIvPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjb2xvciIvPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjbSIvPgogICAgPC9nPiAKCiAgICA8IS0tIHRpbWluZyBsb29wIC0tPgogICAgPHJlY3QgaGVpZ2h0PSIxIiB3aWR0aD0iMSIgeD0iLTEwIiB5PSItMTAiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0idmlzaWJpbGl0eSIgZnJvbT0iaGlkZSIgdG89ImhpZGUiIGJlZ2luPSIwO2xvb3AuZW5kIiBkdXI9IjRzIiBpZD0ibG9vcCIgLz4KICAgIDwvcmVjdD4KPC9zdmc+Cg==";
	const wrist = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBkPSJNIDAgMCBsIDM4IC0xMCBtIDI4OCAtMTMxIGwgMTcgMjYgbSAxMTI3IDEzNCBsIDM1IC01IiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiLz4KICAgICAgICA8ZyBpZD0ic3RhcnQiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgLTI1IGwgMCA1MCIgc3R5bGU9InN0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIgLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIDAgbCAtMTUgLTE1IGwgMCAzMCB6IiBzdHlsZT0ic3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDNweDsgZmlsbDogIzAwMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iZW5kIj4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIC0yNSBsIDAgNTAiIHN0eWxlPSJzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMCAwIGwgMTUgLTE1IGwgMCAzMCB6IiBzdHlsZT0ic3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDNweDsgZmlsbDogIzAwMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgIDwvZz4KICAgIDwvZGVmcz4KICAgIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbCiAgICAgICAgcGF0aCB7ZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDt9CiAgICAgICAgLnRhcGUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAyMHB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLnJlZHRhcGUge3N0cm9rZTogI2YwMDsgc3Ryb2tlLXdpZHRoOiAxcHg7c3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgICAgICAuY29sb3Ige3N0cm9rZTogI2ZmZjg2Yzsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmNtIHtzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogMTZweDsgc3Ryb2tlLWRhc2hhcnJheTogMiAxMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7fQogICAgICAgIC5saW5lIHtzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBzdHJva2UtZGFzaGFycmF5OiA4IDU7IHN0cm9rZS1saW5lY2FwOiByb3VuZDt9CiAgICBdXT48L3N0eWxlPgogICAgCiAgICA8IS0tIEJhY2tncm91bmQgaW1hZ2UgLS0+CiAgICA8aW1hZ2UgeGxpbms6aHJlZj0iLi9zdGFuZGluZy5qcGciIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIC8+CgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ1IDczNSkiPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJyZWR0YXBlIj4KICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utd2lkdGgiIGZyb209IjEiIHRvPSI0NTAiIGJlZ2luPSJsb29wLmJlZ2luKzIuNXMiIGR1cj0iMC41cyIgZmlsbD0iZnJlZXplIiAvPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1vcGFjaXR5IiBmcm9tPSIxIiB0bz0iMCIgYmVnaW49Imxvb3AuYmVnaW4rMi43cyIgZHVyPSIwLjNzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgPC91c2U+CiAgICAgICAgPHVzZSB4PSIwIiB5PSIwIiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InRhcGUiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY29sb3IiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY20iLz4KICAgIDwvZz4gCgogICAgPCEtLSB0aW1pbmcgbG9vcCAtLT4KICAgIDxyZWN0IGhlaWdodD0iMSIgd2lkdGg9IjEiIHg9Ii0xMCIgeT0iLTEwIj4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InZpc2liaWxpdHkiIGZyb209ImhpZGUiIHRvPSJoaWRlIiBiZWdpbj0iMDtsb29wLmVuZCIgZHVyPSI0cyIgaWQ9Imxvb3AiIC8+CiAgICA8L3JlY3Q+Cjwvc3ZnPgo=";
	const ankle = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBkPSJNIDAgMCBsIDQ1IDUgbSAtODM1IC0xNSBsIDQ5IC04IG0gLTY0OCAyMCBsIDU4IC00IiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiLz4KICAgIDwvZGVmcz4KICAgIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbCiAgICAgICAgcGF0aCB7ZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDt9CiAgICAgICAgLnRhcGUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAyMHB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLnJlZHRhcGUge3N0cm9rZTogI2YwMDsgc3Ryb2tlLXdpZHRoOiAxcHg7c3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgICAgICAuY29sb3Ige3N0cm9rZTogI2ZmZjg2Yzsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmNtIHtzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogMTZweDsgc3Ryb2tlLWRhc2hhcnJheTogMiAxMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7fQogICAgXV0+PC9zdHlsZT4KCiAgICA8IS0tIEJhY2tncm91bmQgaW1hZ2UgLS0+CiAgICA8aW1hZ2UgeGxpbms6aHJlZj0iLi9zdGFuZGluZy5qcGciIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIC8+CgogICAgPGc+CiAgICAgICAgPHVzZSB4PSIxNjU1IiB5PSIxMzA1IiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InJlZHRhcGUiPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS13aWR0aCIgZnJvbT0iMSIgdG89IjQ1MCIgYmVnaW49Imxvb3AuYmVnaW4rMi41cyIgZHVyPSIwLjVzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBiZWdpbj0ibG9vcC5iZWdpbisyLjdzIiBkdXI9IjAuM3MiIGZpbGw9ImZyZWV6ZSIgLz4KICAgICAgICA8L3VzZT4KICAgICAgICA8dXNlIHg9IjE2NTUiIHk9IjEzMDUiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0idGFwZSIvPgogICAgICAgIDx1c2UgeD0iMTY1NSIgeT0iMTMwNSIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjb2xvciIvPgogICAgICAgIDx1c2UgeD0iMTY1NSIgeT0iMTMwNSIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjbSIvPgogICAgPC9nPgoKICAgIDwhLS0gdGltaW5nIGxvb3AgLS0+CiAgICA8cmVjdCBoZWlnaHQ9IjEiIHdpZHRoPSIxIiB4PSItMTAiIHk9Ii0xMCI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJ2aXNpYmlsaXR5IiBmcm9tPSJoaWRlIiB0bz0iaGlkZSIgYmVnaW49IjA7bG9vcC5lbmQiIGR1cj0iNHMiIGlkPSJsb29wIiAvPgogICAgPC9yZWN0PgoKPC9zdmc+Cg=="
	const inseam = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIAogICAgPGRlZnM+CiAgICAgICAgPHBhdGggaWQ9InBhdGgiIGQ9Ik0gMCAwIGwgMCA1OTAiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIvPgogICAgICAgIDxnIGlkPSJzdGFydCI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMCAtMjUgbCAwIDUwIiBzdHlsZT0ic3Ryb2tlOiAjZmZmOyBzdHJva2Utd2lkdGg6IDNweDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IiAvPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgMCBsIC0xNSAtMTUgbCAwIDMwIHoiIHN0eWxlPSJzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogM3B4OyBmaWxsOiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSJlbmQiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDAgLTI1IGwgMCA1MCIgc3R5bGU9InN0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIgLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwIDAgbCAxNSAtMTUgbCAwIDMwIHoiIHN0eWxlPSJzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogM3B4OyBmaWxsOiAjMDAwOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiIC8+CiAgICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKICAgICAgICBwYXRoIHtmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kO30KICAgICAgICAudGFwZSB7c3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDIwcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAucmVkdGFwZSB7c3Ryb2tlOiAjZjAwOyBzdHJva2Utd2lkdGg6IDFweDtzdHJva2UtbGluZWNhcDogcm91bmQ7fQogICAgICAgIC5jb2xvciB7c3Ryb2tlOiAjZmZmODZjOyBzdHJva2Utd2lkdGg6IDE2cHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAuY20ge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtZGFzaGFycmF5OiAyIDEwOyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmxpbmUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAzcHg7IHN0cm9rZS1kYXNoYXJyYXk6IDggNTsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgIF1dPjwvc3R5bGU+CiAgICAKICAgIDwhLS0gQmFja2dyb3VuZCBpbWFnZSAtLT4KICAgIDxpbWFnZSB4bGluazpocmVmPSIuL3N0YW5kaW5nLmpwZyIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMDAiIGhlaWdodD0iMTUwMCIgLz4KCiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NjYgNzg2KSI+CiAgICAgICAgPHVzZSB4PSIwIiB5PSIwIiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InJlZHRhcGUiPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS13aWR0aCIgZnJvbT0iMSIgdG89IjQ1MCIgYmVnaW49Imxvb3AuYmVnaW4rMi41cyIgZHVyPSIwLjVzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBiZWdpbj0ibG9vcC5iZWdpbisyLjdzIiBkdXI9IjAuM3MiIGZpbGw9ImZyZWV6ZSIgLz4KICAgICAgICA8L3VzZT4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0idGFwZSIvPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjb2xvciIvPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJjbSIvPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3N0YXJ0IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCkiIC8+CiAgICAgICAgPHVzZSB4PSI1OTAiIHk9IjAiIHhsaW5rOmhyZWY9IiNlbmQiIHRyYW5zZm9ybT0icm90YXRlKDkwKSIgLz4KICAgIDwvZz4gCgogICAgPCEtLSBIZWxwbGluZXMgLS0+CiAgICA8Zz4KICAgICAgICA8cGF0aCBpZD0iZmxvb3JsaW5lIiBjbGFzcz0ibGluZSIgZD0iTSA4MDAgMTM3NiBsIDU0IDAgbSA3MCAwIGwgMTAzIDAgbSAxMTIgMCBsIDUwIDAiPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBmcm9tPSIwIiB0bz0iMTMiIGR1cj0iMXMiIHJlcGVhdER1cj0iaW5kZWZpbml0ZSIgLz4KICAgICAgICA8L3BhdGg+CiAgICA8L2c+CiAgICAKICAgIDwhLS0gdGltaW5nIGxvb3AgLS0+CiAgICA8cmVjdCBoZWlnaHQ9IjEiIHdpZHRoPSIxIiB4PSItMTAiIHk9Ii0xMCI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJ2aXNpYmlsaXR5IiBmcm9tPSJoaWRlIiB0bz0iaGlkZSIgYmVnaW49IjA7bG9vcC5lbmQiIGR1cj0iNHMiIGlkPSJsb29wIiAvPgogICAgPC9yZWN0Pgo8L3N2Zz4K"
	const knee = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBkPSJNIDAgMCBsIDgzIDAgbSAtOTA0IC0xMCBsIDg1IDAgbSAtNjQzIDEwIGwgMTAzIDAiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyIvPgogICAgPC9kZWZzPgogICAgPHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKICAgICAgICBwYXRoIHtmaWxsOiBub25lOyBzdHJva2UtbGluZWpvaW46IHJvdW5kO30KICAgICAgICAudGFwZSB7c3Ryb2tlOiAjMDAwOyBzdHJva2Utd2lkdGg6IDIwcHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAucmVkdGFwZSB7c3Ryb2tlOiAjZjAwOyBzdHJva2Utd2lkdGg6IDFweDtzdHJva2UtbGluZWNhcDogcm91bmQ7fQogICAgICAgIC5jb2xvciB7c3Ryb2tlOiAjZmZmODZjOyBzdHJva2Utd2lkdGg6IDE2cHg7IHN0cm9rZS1saW5lY2FwOiBidXR0O30KICAgICAgICAuY20ge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtZGFzaGFycmF5OiAyIDEwOyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICBdXT48L3N0eWxlPgoKICAgIDwhLS0gQmFja2dyb3VuZCBpbWFnZSAtLT4KICAgIDxpbWFnZSB4bGluazpocmVmPSIuL3N0YW5kaW5nLmpwZyIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMDAiIGhlaWdodD0iMTUwMCIgLz4KCiAgICA8Zz4KICAgICAgICA8dXNlIHg9IjE2NjUiIHk9IjEwMjUiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0icmVkdGFwZSI+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZVR5cGU9IkNTUyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLXdpZHRoIiBmcm9tPSIxIiB0bz0iNDUwIiBiZWdpbj0ibG9vcC5iZWdpbisyLjVzIiBkdXI9IjAuNXMiIGZpbGw9ImZyZWV6ZSIgLz4KICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgZnJvbT0iMSIgdG89IjAiIGJlZ2luPSJsb29wLmJlZ2luKzIuN3MiIGR1cj0iMC4zcyIgZmlsbD0iZnJlZXplIiAvPgogICAgICAgIDwvdXNlPgogICAgICAgIDx1c2UgeD0iMTY2NSIgeT0iMTAyNSIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJ0YXBlIi8+CiAgICAgICAgPHVzZSB4PSIxNjY1IiB5PSIxMDI1IiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9ImNvbG9yIi8+CiAgICAgICAgPHVzZSB4PSIxNjY1IiB5PSIxMDI1IiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9ImNtIi8+CiAgICA8L2c+CgogICAgPCEtLSB0aW1pbmcgbG9vcCAtLT4KICAgIDxyZWN0IGhlaWdodD0iMSIgd2lkdGg9IjEiIHg9Ii0xMCIgeT0iLTEwIj4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InZpc2liaWxpdHkiIGZyb209ImhpZGUiIHRvPSJoaWRlIiBiZWdpbj0iMDtsb29wLmVuZCIgZHVyPSI0cyIgaWQ9Imxvb3AiIC8+CiAgICA8L3JlY3Q+Cgo8L3N2Zz4K"
	const seat_back = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAwMCAxNTAwIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBkPSJNIDAgMCBsIDEwNSAwIE0gMTI4NCAxMCBsIDI3NyAwIiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsiLz4KICAgIDwvZGVmcz4KICAgIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbCiAgICAgICAgcGF0aCB7ZmlsbDogbm9uZTsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDt9CiAgICAgICAgLnRhcGUge3N0cm9rZTogIzAwMDsgc3Ryb2tlLXdpZHRoOiAyMHB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLnJlZHRhcGUge3N0cm9rZTogI2YwMDsgc3Ryb2tlLXdpZHRoOiAxcHg7c3Ryb2tlLWxpbmVjYXA6IHJvdW5kO30KICAgICAgICAuY29sb3Ige3N0cm9rZTogI2ZmZjg2Yzsgc3Ryb2tlLXdpZHRoOiAxNnB4OyBzdHJva2UtbGluZWNhcDogYnV0dDt9CiAgICAgICAgLmNtIHtzdHJva2U6ICMwMDA7IHN0cm9rZS13aWR0aDogMTZweDsgc3Ryb2tlLWRhc2hhcnJheTogMiAxMDsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7fQogICAgXV0+PC9zdHlsZT4KCiAgICA8IS0tIEJhY2tncm91bmQgaW1hZ2UgLS0+CiAgICA8aW1hZ2UgeGxpbms6aHJlZj0iLi9zdGFuZGluZy5qcGciIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiIC8+CgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQ0IDczMykiPgogICAgICAgIDx1c2UgeD0iMCIgeT0iMCIgeGxpbms6aHJlZj0iI3BhdGgiIGNsYXNzPSJyZWR0YXBlIj4KICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iQ1NTIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utd2lkdGgiIGZyb209IjEiIHRvPSI0NTAiIGJlZ2luPSJsb29wLmJlZ2luKzIuNXMiIGR1cj0iMC41cyIgZmlsbD0iZnJlZXplIiAvPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1vcGFjaXR5IiBmcm9tPSIxIiB0bz0iMCIgYmVnaW49Imxvb3AuYmVnaW4rMi43cyIgZHVyPSIwLjNzIiBmaWxsPSJmcmVlemUiIC8+CiAgICAgICAgPC91c2U+CiAgICAgICAgPHVzZSB4PSIwIiB5PSIwIiB4bGluazpocmVmPSIjcGF0aCIgY2xhc3M9InRhcGUiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY29sb3IiLz4KICAgICAgICA8dXNlIHg9IjAiIHk9IjAiIHhsaW5rOmhyZWY9IiNwYXRoIiBjbGFzcz0iY20iLz4KICAgIDwvZz4KCiAgICA8Zz4KICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDogIzk4NWIzZTsgc3Ryb2tlOiBub25lOyIgZD0iTSAzNDQgNzIwIGwgMTEgNDAgbCAzNSAtNSBsIC0xMCAtMzUgIiAvPgogICAgPC9nPgogICAgPCEtLSB0aW1pbmcgbG9vcCAtLT4KICAgIDxyZWN0IGhlaWdodD0iMSIgd2lkdGg9IjEiIHg9Ii0xMCIgeT0iLTEwIj4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVUeXBlPSJDU1MiIGF0dHJpYnV0ZU5hbWU9InZpc2liaWxpdHkiIGZyb209ImhpZGUiIHRvPSJoaWRlIiBiZWdpbj0iMDtsb29wLmVuZCIgZHVyPSI0cyIgaWQ9Imxvb3AiIC8+CiAgICA8L3JlY3Q+Cjwvc3ZnPgo="
	const seat_circ = ""
	const upper_left_circ = ""
	const waist_to_floor = "" // could be torso too?
	const wait_to_knee = ""
	
	function handleOverlayClick(bodyPart) {
		$box_to_checkbox = {
			bodyPart: bodyPart,
			toggle: !$box_to_checkbox
		}
	}

	const onMouseOver = (overlay) => {
		handleMouseover(overlay)
	}	

	const onMouseLeave = () => {
		handleMouseover()
	}

	const bodyPartMap = {
		"shoulder_to_wrist": shoulder_to_wrist,
		"wrist": wrist,
		"bicep": bicep,
		"ankle": ankle,
		"inseam": inseam,
		"knee": knee,
		"seatback": seat_back,
	}
	
	const handleCheckBoxMouseover = (bodyPart) => {
		handleMouseover(
			bodyPartMap[bodyPart]
		)
	}
	
	$: {
		handleCheckBoxMouseover($toggle_overlay)
	}

</script>
<!-- SHOULDER TO WRIST -->
    <div
			class="shoulder-to-wrist-overlay-box1" 
			on:click={(event) => handleOverlayClick("shoulder_to_wrist")}
			on:mouseover={() => onMouseOver(shoulder_to_wrist)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(shoulder_to_wrist)}
			on:keydown={(event) => handleOverlayClick(shoulder_to_wrist)}
			role="button"
			tabindex=0
			/>

<!-- WRIST -->
    <div
			class="wrist-box1" 
			on:click={(event) => handleOverlayClick("wrist")}
			on:mouseover={() => onMouseOver(wrist)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(wrist)}
			on:keydown={(event) => handleOverlayClick(wrist)}
			role="button"
			tabindex=0
			/>
    <div
			class="wrist-box2"
			on:click={(event) => handleOverlayClick("wrist")}
			on:mouseover={() => onMouseOver(wrist)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(wrist)}
			on:keydown={(event) => handleOverlayClick(wrist)}
			role="button"
			tabindex=0
			/>
    <div
			class="wrist-box3" 
			on:click={(event) => handleOverlayClick("wrist")}
			on:mouseover={() => onMouseOver(wrist)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(wrist)}
			on:keydown={(event) => handleOverlayClick(wrist)}
			role="button"
			tabindex=0
			/>

<!-- BICEP -->
    <div 
			class="bicep-box1" 
			on:click={(event) => handleOverlayClick("bicep")}
			on:mouseover={() => onMouseOver(bicep)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(bicep)}
			on:keydown={(event) => handleOverlayClick(bicep)}
			role="button"
			tabindex=0
			/>

    <div 
			class="bicep-box2" 
			on:click={(event) => handleOverlayClick("bicep")}
			on:mouseover={() => onMouseOver(bicep)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(bicep)}
			on:keydown={(event) => handleOverlayClick(bicep)}
			role="button"
			tabindex=0
			/>

    <div 
			class="bicep-box3" 
			on:click={(event) => handleOverlayClick("bicep")}
			on:mouseover={() => onMouseOver(bicep)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(bicep)}
			on:keydown={(event) => handleOverlayClick(bicep)}
			role="button"
			tabindex=0
			/>

<!-- SEATBACK -->
    <div 
			class="seatback-overlay-box1" 
			on:click={(event) => handleOverlayClick("seatback")}
			on:mouseover={() => onMouseOver(seat_back)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(seat_back)}
			on:keydown={(event) => handleOverlayClick(seat_back)}
			role="button"
			tabindex=0
			/>
    <div 
			class="seatback-overlay-box2" 
			on:click={(event) => handleOverlayClick("seatback")}
			on:mouseover={() => onMouseOver(seat_back)}
			on:mouseleave={onMouseLeave}
			on:focus={()=>onMouseOver(seat_back)}
			on:keydown={(event) => handleOverlayClick(seat_back)}
			role="button"
			tabindex=0
			/>	

<!-- INSEAM -->
    <div 
			class="inseam-overlay-box1" 
			on:click={(event) => handleOverlayClick("inseam")}
			on:mouseover={() => onMouseOver(inseam)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(inseam)}
			on:keydown={(event) => handleOverlayClick(inseam)}
			role="button"
			tabindex=0
			/>

<!-- KNEE -->
    <div 
			class="knee-overlay-box1"
			on:click={(event) => handleOverlayClick("knee")}
			on:mouseover={() => onMouseOver(knee)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(knee)}
			on:keydown={(event) => handleOverlayClick(knee)}
			role="button"
			tabindex=0
			/>
    <div 
			class="knee-overlay-box2"
			on:click={(event) => handleOverlayClick("knee")}
			on:mouseover={() => onMouseOver(knee)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(knee)}
			on:keydown={(event) => handleOverlayClick(knee)}
			role="button"
			tabindex=0
			/>
    <div 
			class="knee-overlay-box3"
			on:click={(event) => handleOverlayClick("knee")}
			on:mouseover={() => onMouseOver(knee)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(knee)}
			on:keydown={(event) => handleOverlayClick(knee)}
			role="button"
			tabindex=0
			/>

<!-- ANKLE  -->
    <div 
			class="ankle-overlay-box1" 
			on:click={(event) => handleOverlayClick("ankle")}
			on:mouseover={() => onMouseOver(ankle)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(ankle)}
			on:keydown={(event) =>handleOverlayClick(ankle)}
			role="button"
			tabindex=0
			/>
    <div 
			class="ankle-overlay-box2" 
			on:click={(event) => handleOverlayClick("ankle")}
			on:mouseover={() => onMouseOver(ankle)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(ankle)}
			on:keydown={(event) =>handleOverlayClick(ankle)}
			role="button"
			tabindex=0
			/>
    <div 
			class="ankle-overlay-box3" 
			on:click={(event) => handleOverlayClick("ankle")}
			on:mouseover={() => onMouseOver(ankle)}
			on:mouseleave={onMouseLeave}
			on:focus={() => onMouseOver(ankle)}
			on:keydown={(event) =>handleOverlayClick(ankle)}
			role="button"
			tabindex=0
			/>

<style>
	/* For all overlays*/
	.ankle-overlay-box1:hover,
	.ankle-overlay-box2:hover,
	.ankle-overlay-box3:hover, 
	.knee-overlay-box1:hover,
	.knee-overlay-box2:hover,
	.knee-overlay-box3:hover,
	.inseam-overlay-box1:hover,
	.seatback-overlay-box1:hover,
	.seatback-overlay-box2:hover,
	.shoulder-to-wrist-overlay-box1:hover,
	.bicep-box1:hover,
	.bicep-box2:hover,
	.bicep-box3:hover,
	.wrist-box1:hover,
	.wrist-box2:hover,
	.wrist-box3:hover
	{	
		background-color: rgba(255,255,0,0.2)
	}	
	/* shoulder to wrist, only back figure */
	.shoulder-to-wrist-overlay-box1  {
	    position: absolute;
	    width: 9%;
	    height: 33%;	
		
	    bottom: 47%; 
	    right: 22%;
	}

	/* wrist  */
	.wrist-box1,
	.wrist-box2,
	.wrist-box3 {
	    position: absolute;
	    width: 6%;
	    height: 5%;
	    background-color: transparent;
	}
	
	.wrist-box1  {
	    bottom: 47%; 
	    right: 5%; 
	}
	.wrist-box2  {
	    top: 38%; 
	    left: 30%; 
	}	
	.wrist-box3  {
	    bottom: 48%; 
	    left: 17%; 
	}
	
	/* biceps  */
	.bicep-box1,
	.bicep-box2,
	.bicep-box3 {
	    position: absolute;
	    width: 8%;
	    height: 5%;
	    background-color: transparent;
	}
	
	.bicep-box1  {
	    top: 30%; 
	    right: 5%; 
	}
	.bicep-box2  {
	    top: 26%; 
	    left: 38%; 
	}	
	.bicep-box3  {
	    top: 28%; 
	    left: 13%; 
	}
	
	/* seatback, outer two figures */
	.seatback-overlay-box1  {
	    bottom: 50%; 
	    left: 12%; 
	}
	.seatback-overlay-box2  {
	    bottom: 49%; 
	    left: 75%; 
	}
	.seatback-overlay-box1 {
	    position: absolute;
	    width: 5%;
	    height: 3%;
	    background-color: transparent;
	}	
	.seatback-overlay-box2 {
	    position: absolute;
	    width: 16%;
	    height: 3%;
	    background-color: transparent;
	}	
	
	/* inseam, only in the middle figure */
	.inseam-overlay-box1  {
	    bottom: 9%; 
	    left: 45%; 
	}
	.inseam-overlay-box1 {
	    position: absolute;
	    width: 8%;
	    height: 42%;
	    background-color: transparent;
	}	
	/* knee */
	.knee-overlay-box1  {
	    bottom: 29%; 
	    left: 12.5%; 
	}
	.knee-overlay-box2 {
	    bottom: 30%; 
	    left: 40%; 
	}
	.knee-overlay-box3 {
	    bottom: 29%; 
	    left: 82%; 
	}
	.knee-overlay-box1,
	.knee-overlay-box2,
	.knee-overlay-box3 {
	    position: absolute;
	    width: 8%;
	    height: 5%;
	    background-color: transparent;
	}
	/* ankle */
	.ankle-overlay-box1  {
			bottom: 10%;
			left: 13%;
	}
	.ankle-overlay-box2 {
	    bottom: 12%; 
	    left: 42.5%; 
	}
	.ankle-overlay-box3 {
	    bottom: 10%; 
	    left: 82%; 
	}			
	.ankle-overlay-box1,
	.ankle-overlay-box2,
	.ankle-overlay-box3 {
	    position: absolute;
	    width: 5%;
	    height: 5%;
	    background-color: transparent;
	}	
</style>