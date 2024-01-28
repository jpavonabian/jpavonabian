---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
reply:
uri: "https://jesuspavonabian.es/post/{{ .Name }}"
categories: ["note"] # note, reply, anything else
tags:
draft: true
---

