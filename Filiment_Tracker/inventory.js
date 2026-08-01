const inventoryRows = `
1.0|PLA|Matte|Eryone|In a bag|Printer|0.4|Unknown|Left on the counter!|Ruby Red
2.0|ABS|Normal|Hatchbox|In a bag|Counter|0.2|Unknown||Red
3.0|PLA|Normal|Overture|No|Counter|0.2|Unknown||Black
4.0|PETG|Normal|Jarees|No|Printer|0.2|Maybe||Maroon
5.0|PETG|Normal|Jarees|No|Printer|0.0|Maybe||Maroon
6.0|PETG|Rapid|Elegoo|No|Printer|0.8|Unknown||White
7.0|PETG|HF|Bambu|No|Printer|0.2|Unknown||Black
8.0|PETG|Rapid|Elegoo|No|Printer|0.5|Unknown||White
9.0|PLA|Normal|Overture|No|Printer|0.8|Unknown||White
10.0|PLA|Normal|Overture|No|Printer|0.8|Unknown||Black
11.0|PLA|Normal|Generic|No|Printer|0.4|Unknown||White
12.0|PLA|Normal|Peakace|In a bag|Cabinet 2 PLA|0.3|Unknown||Orange
13.0|PLA|Normal|Peakace|In a bag|Cabinet 2 PLA|0.2|Unknown||Orange
14.0|PLA|Normal|Bambu|In a bag|Cabinet 2 PLA|0.2|Unknown||Green
15.0|PLA|Polyterra Matte|Polymaker|In a bag|Cabinet 2 PLA|0.6|Unknown||Cyan
16.0|PLA|Plus|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||White
17.0|PLA|Normal|Creality Ender|In a bag|Cabinet 2 PLA|0.4|Unknown||Grey
18.0|PLA|Plus|Generic|In a bag|Cabinet 2 PLA|0.6|Unknown||Red
19.0|PLA|Silk|Do3d|In a bag|Cabinet 2 PLA|0.6|Unknown||Grey
20.0|PLA|Silk|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||Grey
21.0|PLA|Normal|Creality Ender|In a bag|Cabinet 2 PLA|0.7|Unknown||White
22.0|PLA|Silk|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||Orange
23.0|PLA|Silk|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||Blue
24.0|PLA|Plus|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||Green
25.0|PLA|Silk|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||White
26.0|PLA|Normal|Generic|Unopened|Cabinet 2 PLA|1.0|Unknown||Black
27.0|PLA|Matte|Bambu|Unopened|Cabinet 2 PLA|1.0|Unknown|Replacement spool needed|Black
28.0|PLA|Matte|Bambu|Unopened|Cabinet 2 PLA|1.0|Unknown|Replacement spool needed|Grey
29.0|PLA|Matte|Bambu|Unopened|Cabinet 2 PLA|1.0|Unknown|Replacement spool needed|Grey
30.0|PLA|Matte|Bambu|Unopened|Cabinet 2 PLA|1.0|Unknown|Replacement spool needed|Black
31.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|White
32.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|White
33.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|Black
34.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|Silver
35.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|Silver
36.0|ABS|Normal|Bambu|Unopened|Cabinet 2 ABS|1.0|Unknown|Replacement spool needed|Black
37.0|ABS|Normal|Generic|In a bag|Cabinet 2 ABS|0.4|Unknown||White
38.0|ABS|Normal|Generic|In a bag|Cabinet 2 ABS|0.7|Unknown||Red
39.0|TPU|Normal|Generic|Unopened|Cabinet 1 Misc.|1.0|Unknown||Black
40.0|PLA|Silk|Generic|In a bag|Cabinet 2 PLA|0.3|Unknown||Grey
41.0|TPU|Normal|Overture|Unopened|Cabinet 1 Misc.|1.0|Unknown||Black
42.0|ABS|Normal|Generic|In a bag|Cabinet 1 Misc.|0.9|Unknown|Bagged with filament 44. Filament 44 is unknown.|Green
43.0|Unknown|Unknown|Generic|In a bag|Cabinet 1 Misc.|0.6|Unknown||Red
44.0|Unknown|Unknown|Generic|No|Cabinet 1 Misc.|0.8|Unknown||White
45.0|Unknown|Unknown|Generic|No|Cabinet 1 Misc.|0.6|Unknown||Tan
46.0|PLA|Glow-in-the-dark|Amolen|In a bag|Cabinet 1 Misc.|0.9|Unknown||Glow
47.0|PA12|CF|Qidi Tech|Unopened|Cabinet 1 Misc.|1.0|Unknown|Made by Qidi|Black
48.0|PLA|Glow-in-the-dark|Amolen|In a bag|Cabinet 1 Misc.|0.9|Unknown||Glow
49.0|PLA|Silk|Eryone|No|Cabinet 1 Misc.|1.0|Unknown||Rainbow
50.0|PLA|Silk|Do3d|In a bag|Cabinet 1 Misc.|0.6|Unknown||Multi-color
51.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.4|Unknown||Blue + Green
52.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.2|Unknown||Rainbow Forest
53.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.2|Unknown||Rainbow Universe
54.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.3|Unknown|Bagged with 56 and 57.|Red + Blue
55.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.3|Unknown|Bagged with 55 and 57.|Candy
56.0|PLA|Silk|Eryone|In a bag|Cabinet 1 Misc.|0.8|Unknown|Bagged with 55 and 56.|Red + Green
`;

window.DEFAULT_INVENTORY = inventoryRows
  .trim()
  .split("\n")
  .map((row) => {
    const [id, material, finish, brand, sealed, location, amount, restock, notes, color] = row.split("|");
    return {
      id,
      material,
      finish,
      brand,
      sealed,
      location,
      amount: Number(amount),
      restock,
      notes,
      color
    };
  });
