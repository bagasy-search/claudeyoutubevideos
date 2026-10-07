# Miniaturas + tarjetas Old House Fix — tanda invierno (7-oct-2026) · PENDIENTE: OpenAI desactivada

Moldes = JOYAS (≥2 años, siguen trayendo tráfico, nadie las re-empaquetó), sacadas con
`node analizador/gemas.mjs ...` → `gemas_invierno.json`. Los outliers de Jhon/Earl/Ramón NO se clonan:
cada uno ya tiene 5–8 copias de granjas con views en caída (molde quemado). De ellos se toma solo el ESTILO.

| # | Título (palabra movida) | Molde (canal · edad · views · /día) |
|---|---|---|
| 1 | How To Bleed An **Old** Radiator - Don't try it until you watch this | Allen Hart · 6a · 2,34M · 1071 · `tbLz8icLr2U` |
| 2 | No Hot Water: **Gas** Water Heater Troubleshooting | Pros DIY · 7a · 2,61M · 1021 · `_XYCVgsPu1U` |
| 3 | Is It **Cheaper** To Leave The Heating On Constantly? | Heat Geek · 4a · 903K · 619 · `kGs_biFA87Q` |
| 4 | How to Prevent Frozen Pipes **Every** Winter | Roto-Rooter · 12a · 1,53M · 349 · `1jE932GQeiQ` |
| 5 | Furnace **Keeps** Cycling On and Off? Flame Sensor Cleaning - Furnace Troubleshooting | FIX IT · 12a · 1,93M · 440 · `tYwR9qL4lnk` |
| 6 | Foggy **Old** Double Pane Window Fix! | Things Humans Do · 5a · 653K · 358 · `S9cGT2jGiSY` |
| 7 | Dryer Vent Cleaning - This Is How **I** Do It. | TheDryerVentDoctor (3,7K subs) · 13a · 1,16M · 244 · `KQAXcPIpuiQ` |
| 8 | DIY: **Stopping** ice dams on your roof | Yoshimoshi · 5a · 450K · 247 · `_3EqD_-u0lo` |
| 9 | Seal the Gap on the Bottom **of Your** Entry Door | Danny Lipford · 12a · 858K · 196 · `zJaJVKZ6V-s` |
| 10 | FIX Hot and Cold Spots in Your **Old** House, For Forced Air Systems Only | Kris Kasprzak · 11a · 612K · 153 · `8dJbLTEXyfg` |

Estilo (Jhon/Earl/Ramón): foto hiperreal, presentador en un tercio lateral mirando a cámara serio, objeto
héroe grande al centro, 2–4 palabras arriba-izq blanco+amarillo con contorno negro, flecha curva al objeto.
Cara = foto REAL "hombre 70´" de la librería de avatares de Bagasy (afeitado, pelo gris hacia atrás) — NO la
foto de perfil barbuda (esa es la cara vieja Amish) ni la entrada "the-old-house-fix" de la librería (sombrero de paja).

## Para generar cuando haya clave de OpenAI
1. Bajar refs: `molds/<id>.jpg` = `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` (Earl AQZLwcBnX1I, Jhon fX4qYS3lQqY,
   Ramón k1HGyewDZ_k) y `ref/hank_face.png` = recorte de la foto "hombre 70´" (avatars/…/library, persona hombre-70).
2. `node scripts/openai_batch_images.mjs submit canales/oldhousefix_thumbs/list.json <out> 1792x1008 low` (desde una
   carpeta donde existan molds/ y ref/), `poll`, `fetch`. QC visual de cada una (cara, manos, texto).
3. Subir a `thumbnails/<user_id>/plan-oldhousefix-<ts>-<i>.png` (path CON el canal), HEAD 200, y PREPEND de 10 tarjetas
   en `tracked_channels` id 147 (backup del plan antes; `done:false`).
