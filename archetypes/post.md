---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
reply:
uri: "{{ .Permalink }}"
categories: ["note"] # note, reply, anything else
tags:
draft: true
---

