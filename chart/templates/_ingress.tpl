
{{/*
Determine whether the ingress should be created by examining local and global values
*/}}
{{- define "omar-ui.ingress.enabled" -}}
{{- $globals := and (hasKey .Values.global.ingress "enabled") (kindIs "bool" .Values.global.ingress.enabled) -}}
{{- $locals := and (hasKey .Values.ingress "enabled") (kindIs "bool" .Values.ingress.enabled) -}}
{{- if $locals }}
{{-   .Values.ingress.enabled }}
{{- else if $globals }}
{{-  .Values.global.ingress.enabled }}
{{- else }}
{{-   true }}
{{- end -}}
{{- end -}}

{{/*
Determine the ingress class name
*/}}
{{- define "omar-ui.ingress.className" -}}
{{- pluck "class" .Values.ingress .Values.global.ingress | first | default "nginx" -}}
{{- end -}}
