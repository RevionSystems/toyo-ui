import type { Manual, Part, Procedure, Supplier, VehicleSystem } from './types';

/*
 * Synthetic engineering dataset. All suppliers, part numbers and figures are fictional
 * and exist only to demonstrate relational navigation and search.
 */

export const systems: VehicleSystem[] = [
  { id: 'powertrain', name: 'Powertrain', description: 'Hybrid transaxle, e-motors and engine assemblies.', image: '/img/hybrid-engine.jpg' },
  { id: 'battery', name: 'Battery System', description: 'High-voltage pack, modules, BMS and charging hardware.', image: '/img/ev-charging.jpg' },
  { id: 'thermal', name: 'Thermal Management', description: 'Coolant circuits, heat pump and battery conditioning.', image: '/img/cutaway.jpg' },
  { id: 'chassis', name: 'Chassis & Suspension', description: 'Subframes, dampers, springs, steering and wheels.', image: '/img/suspension.jpg' },
  { id: 'braking', name: 'Braking System', description: 'Friction brakes, brake-by-wire and ABS sensors.', image: '/img/brake-caliper.jpg' },
  { id: 'body', name: 'Body Structure', description: 'Body-in-white, closures and crash structures.', image: '/img/assembly-line.jpg' },
  { id: 'electrical', name: 'Electrical & Electronics', description: 'Harnesses, ECUs, sensors and low-voltage power.', image: '/img/exploded-chassis.jpg' },
  { id: 'interior', name: 'Interior & Safety', description: 'Cockpit modules, restraints and HMI controls.', image: '/img/steering.jpg' },
];

export const suppliers: Supplier[] = [
  { id: 'SP-1007', name: 'Kaneda Brake Systems', country: 'Japan', region: 'Asia', capabilities: ['Calipers', 'Rotors', 'Brake-by-wire'], certifications: ['IATF 16949', 'ISO 14001'], leadTimeDays: 21, onTimeRate: 98.4, status: 'approved' },
  { id: 'SP-2041', name: 'Hoshino Friction Materials', country: 'Japan', region: 'Asia', capabilities: ['Brake pads', 'Shims', 'Clips'], certifications: ['IATF 16949'], leadTimeDays: 14, onTimeRate: 97.1, status: 'approved' },
  { id: 'SP-2210', name: 'Nordmark Castings', country: 'Germany', region: 'Europe', capabilities: ['Iron castings', 'Rotors', 'Knuckles'], certifications: ['IATF 16949', 'ISO 50001'], leadTimeDays: 35, onTimeRate: 93.6, status: 'conditional' },
  { id: 'SP-3105', name: 'Valdera Electronics', country: 'Mexico', region: 'North America', capabilities: ['ECUs', 'Wheel-speed sensors', 'Harnesses'], certifications: ['IATF 16949', 'ISO 26262 ASIL-D'], leadTimeDays: 28, onTimeRate: 96.2, status: 'approved' },
  { id: 'SP-3380', name: 'Sakura Cell Technologies', country: 'Japan', region: 'Asia', capabilities: ['Li-ion cells', 'Battery modules'], certifications: ['IATF 16949', 'UN 38.3'], leadTimeDays: 42, onTimeRate: 95.0, status: 'approved' },
  { id: 'SP-4012', name: 'Arcturus Thermal', country: 'Czech Republic', region: 'Europe', capabilities: ['Heat exchangers', 'Coolant pumps', 'Chillers'], certifications: ['IATF 16949'], leadTimeDays: 30, onTimeRate: 94.8, status: 'approved' },
  { id: 'SP-4477', name: 'Midori Drive Systems', country: 'Japan', region: 'Asia', capabilities: ['Transaxles', 'E-motors', 'Gearsets'], certifications: ['IATF 16949', 'ISO 14001'], leadTimeDays: 56, onTimeRate: 97.9, status: 'approved' },
  { id: 'SP-5120', name: 'Ridgeline Suspension Co.', country: 'United States', region: 'North America', capabilities: ['Dampers', 'Coil springs', 'Stabilizer bars'], certifications: ['IATF 16949'], leadTimeDays: 24, onTimeRate: 91.2, status: 'under-review' },
  { id: 'SP-5588', name: 'Tessaro Steel Stamping', country: 'Italy', region: 'Europe', capabilities: ['Hot stamping', 'Body panels', 'Reinforcements'], certifications: ['IATF 16949', 'ISO 14001'], leadTimeDays: 38, onTimeRate: 95.7, status: 'approved' },
  { id: 'SP-6034', name: 'Kitagawa Elastomers', country: 'Thailand', region: 'Asia', capabilities: ['Engine mounts', 'Bushings', 'Seals'], certifications: ['IATF 16949'], leadTimeDays: 19, onTimeRate: 98.9, status: 'approved' },
  { id: 'SP-6650', name: 'Lumen Interior Systems', country: 'Canada', region: 'North America', capabilities: ['Steering wheels', 'Airbag modules', 'Switchgear'], certifications: ['IATF 16949', 'ISO 26262 ASIL-B'], leadTimeDays: 26, onTimeRate: 96.5, status: 'approved' },
  { id: 'SP-7002', name: 'Halvorsen Fasteners', country: 'Sweden', region: 'Europe', capabilities: ['Bolts', 'Studs', 'Lock nuts'], certifications: ['IATF 16949'], leadTimeDays: 10, onTimeRate: 99.3, status: 'approved' },
];

export const parts: Part[] = [
  // Braking
  { id: 'PT-3310-12A', name: 'Brake Caliper (Front)', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'Four-piston fixed aluminium caliper for ventilated front rotors.', material: 'Cast aluminium A356-T6', weightKg: 3.9, revision: 'C', status: 'released', supplierIds: ['SP-1007', 'SP-2210'], image: '/img/brake-caliper.jpg' },
  { id: 'PT-3310-12B', name: 'Brake Pad Set (Front)', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'Low-copper ceramic pad set with wear indicator, axle set of four.', material: 'Ceramic composite', weightKg: 1.6, revision: 'B', status: 'released', supplierIds: ['SP-2041'] },
  { id: 'PT-3310-12C', name: 'Brake Disc Rotor (Front)', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'Ventilated 340 mm grey-iron rotor with directional vanes.', material: 'Grey iron G3000', weightKg: 9.8, revision: 'B', status: 'released', supplierIds: ['SP-2210', 'SP-1007'] },
  { id: 'PT-3310-12D', name: 'Hub Assembly (Front)', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'Gen-3 hub bearing unit with integrated ABS tone ring.', material: 'Bearing steel SUJ2', weightKg: 2.7, revision: 'A', status: 'released', supplierIds: ['SP-1007'] },
  { id: 'PT-3310-14A', name: 'Anti-Rattle Clip', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'Stainless spring clip that preloads pads against the caliper abutment.', material: 'Stainless steel 301', weightKg: 0.02, revision: 'A', status: 'released', supplierIds: ['SP-2041'] },
  { id: 'PT-3310-15A', name: 'Caliper Mounting Bolt', systemId: 'braking', assembly: 'Front Brake Assembly', description: 'M14×1.5 flanged bolt with pre-applied threadlocker, pack of two.', material: 'Alloy steel 10.9', weightKg: 0.12, revision: 'A', status: 'released', supplierIds: ['SP-7002'] },
  { id: 'PT-3320-02A', name: 'ABS Wheel-Speed Sensor', systemId: 'braking', assembly: 'ABS Module', description: 'Active Hall-effect sensor with 2-pin connector.', material: 'PBT housing / copper', weightKg: 0.08, revision: 'D', status: 'released', supplierIds: ['SP-3105'] },
  { id: 'PT-3320-05A', name: 'Brake Hose (Front)', systemId: 'braking', assembly: 'Hydraulic Lines', description: 'Reinforced EPDM flexible hose with banjo fitting.', material: 'EPDM / steel', weightKg: 0.21, revision: 'B', status: 'in-review', supplierIds: ['SP-1007'] },
  { id: 'PT-3340-01A', name: 'Brake Caliper (Rear)', systemId: 'braking', assembly: 'Rear Brake Assembly', description: 'Single-piston floating caliper with integrated electric parking brake.', material: 'Ductile iron', weightKg: 3.1, revision: 'B', status: 'released', supplierIds: ['SP-1007'] },
  // Powertrain
  { id: 'PT-1230-0A1', name: 'Engine Mounting Insulator', systemId: 'powertrain', assembly: 'Powertrain Mounts', description: 'Hydraulic engine mount, right-hand side.', material: 'Natural rubber / aluminium', weightKg: 1.4, revision: 'C', status: 'released', supplierIds: ['SP-6034'], image: '/img/part-label.jpg' },
  { id: 'PT-1410-20A', name: 'Hybrid Transaxle Assembly', systemId: 'powertrain', assembly: 'Hybrid Transaxle', description: 'Power-split transaxle with two motor-generators and planetary gearset.', material: 'Aluminium housing', weightKg: 86.0, revision: 'E', status: 'released', supplierIds: ['SP-4477'], image: '/img/technician.jpg' },
  { id: 'PT-1410-22A', name: 'Motor-Generator MG2', systemId: 'powertrain', assembly: 'Hybrid Transaxle', description: 'Permanent-magnet traction motor, 134 kW peak.', material: 'Electrical steel / NdFeB', weightKg: 24.5, revision: 'B', status: 'released', supplierIds: ['SP-4477'] },
  { id: 'PT-1410-30A', name: 'Planetary Gear Carrier', systemId: 'powertrain', assembly: 'Hybrid Transaxle', description: 'Carrier for the power-split planetary set.', material: 'Case-hardened steel', weightKg: 4.2, revision: 'A', status: 'in-review', supplierIds: ['SP-4477'] },
  { id: 'PT-1250-11A', name: 'Engine Cover (Hybrid)', systemId: 'powertrain', assembly: 'Engine Dress-up', description: 'Acoustic engine cover with integrated air duct.', material: 'PA6-GF30', weightKg: 1.1, revision: 'A', status: 'released', supplierIds: ['SP-6034'], image: '/img/hybrid-engine.jpg' },
  // Battery
  { id: 'PT-8100-01A', name: 'HV Battery Pack', systemId: 'battery', assembly: 'HV Battery', description: '71 kWh pack, 96s cell configuration with structural enclosure.', material: 'Aluminium extrusion', weightKg: 438.0, revision: 'D', status: 'released', supplierIds: ['SP-3380'] },
  { id: 'PT-8100-05A', name: 'Battery Module', systemId: 'battery', assembly: 'HV Battery', description: '12-cell prismatic module with cell-voltage sensing board.', material: 'Li-ion NMC 811', weightKg: 36.0, revision: 'C', status: 'released', supplierIds: ['SP-3380'] },
  { id: 'PT-8120-02A', name: 'Battery Management ECU', systemId: 'battery', assembly: 'HV Battery', description: 'Master BMS controller with isolation monitoring.', material: 'PCB assembly', weightKg: 0.6, revision: 'F', status: 'released', supplierIds: ['SP-3105'] },
  { id: 'PT-8200-01A', name: 'AC Charging Inlet', systemId: 'battery', assembly: 'Charging', description: 'Combined AC/DC inlet with illuminated status ring and lock actuator.', material: 'PC/ABS / copper', weightKg: 1.3, revision: 'B', status: 'in-review', supplierIds: ['SP-3105'], image: '/img/ev-charging.jpg' },
  // Thermal
  { id: 'PT-8800-10A', name: 'Battery Chiller', systemId: 'thermal', assembly: 'Battery Conditioning', description: 'Refrigerant-to-coolant plate heat exchanger.', material: 'Brazed aluminium', weightKg: 1.9, revision: 'B', status: 'released', supplierIds: ['SP-4012'] },
  { id: 'PT-8800-14A', name: 'Electric Coolant Pump', systemId: 'thermal', assembly: 'Coolant Circuit', description: '12 V brushless pump, 30 L/min.', material: 'PPS-GF40', weightKg: 0.9, revision: 'C', status: 'released', supplierIds: ['SP-4012'] },
  // Chassis
  { id: 'PT-4810-30A', name: 'Front Strut Assembly', systemId: 'chassis', assembly: 'Front Suspension', description: 'MacPherson strut with twin-tube damper and coil spring.', material: 'Steel / hydraulic oil', weightKg: 7.4, revision: 'C', status: 'released', supplierIds: ['SP-5120'], image: '/img/suspension.jpg' },
  { id: 'PT-4810-41A', name: 'Lower Control Arm (Front)', systemId: 'chassis', assembly: 'Front Suspension', description: 'Forged aluminium L-arm with hydro-bushing.', material: 'Forged aluminium 6082', weightKg: 3.3, revision: 'B', status: 'released', supplierIds: ['SP-2210', 'SP-6034'] },
  { id: 'PT-4810-55A', name: 'Steering Knuckle (Front)', systemId: 'chassis', assembly: 'Front Suspension', description: 'Cast knuckle carrying hub, caliper and strut mounts.', material: 'Ductile iron', weightKg: 5.6, revision: 'B', status: 'released', supplierIds: ['SP-2210'] },
  // Body
  { id: 'PT-6100-01A', name: 'B-Pillar Reinforcement', systemId: 'body', assembly: 'Body-in-White', description: 'Hot-stamped tailored-blank B-pillar.', material: 'Boron steel 22MnB5', weightKg: 6.2, revision: 'C', status: 'released', supplierIds: ['SP-5588'] },
  { id: 'PT-6100-12A', name: 'Front Crash Rail', systemId: 'body', assembly: 'Body-in-White', description: 'Crush-initiated front longitudinal rail.', material: 'DP800 steel', weightKg: 4.8, revision: 'B', status: 'released', supplierIds: ['SP-5588'] },
  // Electrical
  { id: 'PT-7200-08A', name: 'Main Body Harness', systemId: 'electrical', assembly: 'Wiring', description: 'Primary body harness with 214 circuits.', material: 'Copper / PVC', weightKg: 11.5, revision: 'G', status: 'released', supplierIds: ['SP-3105'] },
  { id: 'PT-7300-02A', name: 'Brake Control ECU', systemId: 'electrical', assembly: 'Chassis Electronics', description: 'Integrated brake-by-wire and stability control unit.', material: 'PCB / aluminium', weightKg: 2.4, revision: 'C', status: 'released', supplierIds: ['SP-3105', 'SP-1007'] },
  // Interior
  { id: 'PT-7700-01A', name: 'Steering Wheel Assembly', systemId: 'interior', assembly: 'Cockpit', description: 'Leather steering wheel with switch pods and heater element.', material: 'Magnesium armature / leather', weightKg: 1.8, revision: 'B', status: 'released', supplierIds: ['SP-6650'], image: '/img/steering.jpg' },
  { id: 'PT-7700-05A', name: 'Driver Airbag Module', systemId: 'interior', assembly: 'Restraints', description: 'Dual-stage driver airbag module.', material: 'Nylon 6.6 / inflator', weightKg: 0.9, revision: 'D', status: 'released', supplierIds: ['SP-6650'] },
];

export const procedures: Procedure[] = [
  { id: 'MP-BR-101', name: 'Front brake corner sub-assembly', systemId: 'braking', plant: 'Plant 2 — Shizuoka', station: 'CH-14', cycleTimeSec: 68, manualIds: ['BR-0012'] },
  { id: 'MP-BR-102', name: 'Caliper bolt torque & audit', systemId: 'braking', plant: 'Plant 2 — Shizuoka', station: 'CH-15', cycleTimeSec: 42, manualIds: ['BR-0012'] },
  { id: 'MP-BR-110', name: 'Brake fluid fill & bleed', systemId: 'braking', plant: 'Plant 2 — Shizuoka', station: 'FL-03', cycleTimeSec: 95, manualIds: ['BR-0012', 'BR-0020'] },
  { id: 'MP-BR-120', name: 'ABS sensor install & air-gap check', systemId: 'braking', plant: 'Plant 2 — Shizuoka', station: 'CH-16', cycleTimeSec: 51, manualIds: ['BR-0035'] },
  { id: 'MP-BR-130', name: 'End-of-line brake roller test', systemId: 'braking', plant: 'Plant 2 — Shizuoka', station: 'EOL-02', cycleTimeSec: 120, manualIds: ['BR-0020'] },
  { id: 'MP-BR-140', name: 'Hub & knuckle marriage', systemId: 'braking', plant: 'Plant 4 — Guanajuato', station: 'CH-08', cycleTimeSec: 74, manualIds: ['BR-0012'] },
  { id: 'MP-PT-201', name: 'Transaxle-to-engine mating', systemId: 'powertrain', plant: 'Plant 1 — Aichi', station: 'PT-05', cycleTimeSec: 110, manualIds: ['PT-0101'] },
  { id: 'MP-PT-210', name: 'Engine mount installation', systemId: 'powertrain', plant: 'Plant 1 — Aichi', station: 'PT-09', cycleTimeSec: 58, manualIds: ['PT-0140'] },
  { id: 'MP-HV-301', name: 'HV battery pack marriage', systemId: 'battery', plant: 'Plant 4 — Guanajuato', station: 'HV-01', cycleTimeSec: 180, manualIds: ['HV-0201'] },
  { id: 'MP-HV-310', name: 'HV isolation resistance test', systemId: 'battery', plant: 'Plant 4 — Guanajuato', station: 'HV-04', cycleTimeSec: 90, manualIds: ['HV-0201', 'HV-0215'] },
  { id: 'MP-CH-401', name: 'Front strut module install', systemId: 'chassis', plant: 'Plant 2 — Shizuoka', station: 'CH-11', cycleTimeSec: 81, manualIds: ['CH-0310'] },
  { id: 'MP-BD-501', name: 'B-pillar spot weld sequence', systemId: 'body', plant: 'Plant 3 — Kentucky', station: 'BIW-22', cycleTimeSec: 64, manualIds: ['BD-0402'] },
];

export const manuals: Manual[] = [
  {
    id: 'BR-0012', title: 'Front Brake Assembly (Disc)', systemId: 'braking', revision: 'B', updated: '2024-05-14', status: 'approved',
    summary: 'Assembly, inspection and service information for the front disc brake, including component identification, torque specifications and quality checkpoints.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 12,
    partIds: ['PT-3310-12A', 'PT-3310-12B', 'PT-3310-12C', 'PT-3310-12D', 'PT-3310-14A', 'PT-3310-15A', 'PT-3320-05A', 'PT-4810-55A'],
    procedureIds: ['MP-BR-101', 'MP-BR-102', 'MP-BR-110', 'MP-BR-140'],
    sections: [
      { heading: 'Component identification', body: 'The front corner comprises the hub assembly, ventilated rotor, four-piston caliper, pad set with anti-rattle clips, and the flexible brake hose. Verify part revisions against the vehicle build sheet before assembly.' },
      { heading: 'Installation procedure', body: '1. Seat the rotor on the hub flange and confirm runout ≤ 0.05 mm. 2. Fit pads and anti-rattle clips. 3. Mount the caliper using new mounting bolts and torque to specification. 4. Connect the brake hose with new copper washers. 5. Bleed the system per BR-0020.' },
      { heading: 'Quality checkpoints', body: 'Record caliper bolt torque on the traceability tag. Inspect hose routing for clearance ≥ 15 mm from the strut at full lock. Confirm no fluid seepage after the pressure hold test.' },
    ],
    torqueSpecs: [
      { item: 'Front caliper bolt', newtonMeters: 110 },
      { item: 'Caliper bracket bolt', newtonMeters: 180 },
      { item: 'Brake hose bolt', newtonMeters: 35 },
      { item: 'Wheel nut', newtonMeters: 103 },
    ],
    tags: ['brake', 'disc', 'caliper', 'rotor', 'pads', 'torque', 'front'],
  },
  {
    id: 'BR-0020', title: 'Brake System Inspection', systemId: 'braking', revision: 'A', updated: '2024-03-02', status: 'approved',
    summary: 'Periodic inspection of hydraulic brake components, fluid condition, pad wear and end-of-line brake performance testing.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 9,
    partIds: ['PT-3310-12B', 'PT-3310-12C', 'PT-3320-05A', 'PT-3340-01A'],
    procedureIds: ['MP-BR-110', 'MP-BR-130'],
    sections: [
      { heading: 'Fluid inspection', body: 'Check fluid level and moisture content. Replace fluid if water content exceeds 3%.' },
      { heading: 'Wear limits', body: 'Minimum pad thickness 2.0 mm. Minimum rotor thickness is cast on the rotor hat.' },
    ],
    torqueSpecs: [{ item: 'Bleeder screw', newtonMeters: 9 }],
    tags: ['brake', 'inspection', 'fluid', 'wear', 'bleed'],
  },
  {
    id: 'BR-0035', title: 'ABS Sensor Replacement', systemId: 'braking', revision: 'C', updated: '2024-07-21', status: 'approved',
    summary: 'Removal, installation and air-gap verification for active wheel-speed sensors.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 6,
    partIds: ['PT-3320-02A', 'PT-3310-12D', 'PT-7300-02A'],
    procedureIds: ['MP-BR-120'],
    sections: [
      { heading: 'Removal', body: 'Disconnect the 2-pin connector and release the harness clips before removing the sensor bolt.' },
      { heading: 'Verification', body: 'Clear DTCs and confirm all four wheel-speed signals agree within 1 km/h on a road test.' },
    ],
    torqueSpecs: [{ item: 'Sensor retaining bolt', newtonMeters: 8 }],
    tags: ['abs', 'sensor', 'wheel speed', 'brake', 'dtc'],
  },
  {
    id: 'BR-0041', title: 'Rear Caliper & Electric Parking Brake', systemId: 'braking', revision: 'A', updated: '2024-09-03', status: 'in-review',
    summary: 'Service mode activation and replacement of the rear caliper with integrated electric parking brake actuator.',
    appliesTo: 'Global Platform (2024–)', readMinutes: 8,
    partIds: ['PT-3340-01A', 'PT-7300-02A'], procedureIds: [],
    sections: [{ heading: 'Service mode', body: 'Retract the EPB actuator using the diagnostic tool before removing the caliper.' }],
    torqueSpecs: [{ item: 'Rear caliper bolt', newtonMeters: 32 }],
    tags: ['brake', 'rear', 'parking brake', 'epb', 'caliper'],
  },
  {
    id: 'PT-0101', title: 'Hybrid Transaxle Installation', systemId: 'powertrain', revision: 'E', updated: '2024-06-11', status: 'approved',
    summary: 'Mating the hybrid transaxle to the engine, including alignment dowels, motor-generator connections and fluid fill.',
    appliesTo: 'Hybrid variants (2023–)', readMinutes: 15,
    partIds: ['PT-1410-20A', 'PT-1410-22A', 'PT-1410-30A'], procedureIds: ['MP-PT-201'],
    sections: [
      { heading: 'Alignment', body: 'Confirm both dowels are present. Never draw the transaxle to the engine using the bolts.' },
      { heading: 'HV connections', body: 'Connect MG1 and MG2 three-phase cables only after the service plug has been removed for 10 minutes.' },
    ],
    torqueSpecs: [{ item: 'Transaxle-to-engine bolt', newtonMeters: 64 }, { item: 'Three-phase terminal', newtonMeters: 8 }],
    tags: ['transaxle', 'hybrid', 'motor', 'powertrain', 'installation'],
  },
  {
    id: 'PT-0140', title: 'Engine Mount Replacement', systemId: 'powertrain', revision: 'C', updated: '2023-11-30', status: 'approved',
    summary: 'Supporting the powertrain and replacing hydraulic engine mounts.',
    appliesTo: 'All ICE and hybrid variants', readMinutes: 7,
    partIds: ['PT-1230-0A1', 'PT-1250-11A'], procedureIds: ['MP-PT-210'],
    sections: [{ heading: 'Support', body: 'Support the engine at the designated lift points before releasing any mount.' }],
    torqueSpecs: [{ item: 'Mount-to-body bolt', newtonMeters: 87 }, { item: 'Mount-to-bracket nut', newtonMeters: 52 }],
    tags: ['engine', 'mount', 'insulator', 'powertrain', 'vibration'],
  },
  {
    id: 'HV-0201', title: 'HV Battery Pack Removal & Installation', systemId: 'battery', revision: 'D', updated: '2024-08-09', status: 'approved',
    summary: 'Safe de-energization, lifting and installation of the high-voltage battery pack.',
    appliesTo: 'BEV & PHEV variants (2023–)', readMinutes: 18,
    partIds: ['PT-8100-01A', 'PT-8100-05A', 'PT-8120-02A'], procedureIds: ['MP-HV-301', 'MP-HV-310'],
    sections: [
      { heading: 'Safety', body: 'Only certified HV technicians may perform this work. Wear Class 0 insulated gloves and verify zero voltage.' },
      { heading: 'Installation', body: 'Torque pack mounting bolts in the cross pattern shown in Figure 4-12.' },
    ],
    torqueSpecs: [{ item: 'Pack mounting bolt', newtonMeters: 95 }],
    tags: ['battery', 'high voltage', 'hv', 'pack', 'safety', 'ev'],
  },
  {
    id: 'HV-0215', title: 'Battery Management System Diagnostics', systemId: 'battery', revision: 'B', updated: '2024-04-18', status: 'approved',
    summary: 'Interpreting BMS fault codes, cell balancing and isolation resistance measurement.',
    appliesTo: 'BEV & PHEV variants (2023–)', readMinutes: 10,
    partIds: ['PT-8120-02A', 'PT-8100-05A'], procedureIds: ['MP-HV-310'],
    sections: [{ heading: 'Isolation test', body: 'Isolation resistance must exceed 500 Ω/V at pack nominal voltage.' }],
    torqueSpecs: [],
    tags: ['battery', 'bms', 'diagnostics', 'isolation', 'ev'],
  },
  {
    id: 'HV-0230', title: 'Charging Inlet Service', systemId: 'battery', revision: 'A', updated: '2024-10-01', status: 'draft',
    summary: 'Replacement of the AC/DC charging inlet and status illumination ring.',
    appliesTo: 'BEV variants (2024–)', readMinutes: 5,
    partIds: ['PT-8200-01A'], procedureIds: [],
    sections: [{ heading: 'Lock actuator', body: 'Test the inlet lock actuator in both directions after replacement.' }],
    torqueSpecs: [{ item: 'Inlet mounting screw', newtonMeters: 6 }],
    tags: ['charging', 'inlet', 'ev', 'battery'],
  },
  {
    id: 'TM-0510', title: 'Battery Thermal Conditioning Circuit', systemId: 'thermal', revision: 'B', updated: '2024-02-26', status: 'approved',
    summary: 'Layout, fill and bleed of the battery chiller and coolant circuit.',
    appliesTo: 'BEV & PHEV variants (2023–)', readMinutes: 11,
    partIds: ['PT-8800-10A', 'PT-8800-14A', 'PT-8100-01A'], procedureIds: [],
    sections: [{ heading: 'Vacuum fill', body: 'Use vacuum fill to below 10 mbar to prevent air pockets in the cold plate.' }],
    torqueSpecs: [{ item: 'Chiller bracket bolt', newtonMeters: 22 }],
    tags: ['thermal', 'coolant', 'chiller', 'battery', 'pump'],
  },
  {
    id: 'CH-0310', title: 'Front Suspension Overhaul', systemId: 'chassis', revision: 'C', updated: '2024-01-15', status: 'approved',
    summary: 'Strut, control arm and knuckle replacement with wheel alignment requirements.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 14,
    partIds: ['PT-4810-30A', 'PT-4810-41A', 'PT-4810-55A', 'PT-3310-12D'], procedureIds: ['MP-CH-401'],
    sections: [{ heading: 'Alignment', body: 'Perform a four-wheel alignment after replacing any front suspension component.' }],
    torqueSpecs: [{ item: 'Strut top nut', newtonMeters: 47 }, { item: 'Lower arm ball joint', newtonMeters: 124 }],
    tags: ['suspension', 'strut', 'control arm', 'knuckle', 'alignment', 'chassis'],
  },
  {
    id: 'BD-0402', title: 'B-Pillar Sectioning & Repair', systemId: 'body', revision: 'B', updated: '2023-12-05', status: 'approved',
    summary: 'Approved sectioning locations and joining methods for the hot-stamped B-pillar.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 13,
    partIds: ['PT-6100-01A'], procedureIds: ['MP-BD-501'],
    sections: [{ heading: 'Do not heat', body: 'Never apply heat to boron steel components; replace at factory seams only.' }],
    torqueSpecs: [],
    tags: ['body', 'pillar', 'structure', 'repair', 'welding'],
  },
  {
    id: 'EE-0620', title: 'Brake Control ECU Programming', systemId: 'electrical', revision: 'C', updated: '2024-06-30', status: 'approved',
    summary: 'Software flashing, variant coding and calibration of the brake control ECU.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 9,
    partIds: ['PT-7300-02A', 'PT-3320-02A'], procedureIds: [],
    sections: [{ heading: 'Calibration', body: 'Run yaw-rate and steering-angle zero-point calibration after programming.' }],
    torqueSpecs: [{ item: 'ECU bracket bolt', newtonMeters: 10 }],
    tags: ['ecu', 'brake', 'programming', 'calibration', 'electrical'],
  },
  {
    id: 'IN-0710', title: 'Steering Wheel & Airbag Removal', systemId: 'interior', revision: 'D', updated: '2024-05-02', status: 'approved',
    summary: 'Safe removal of the driver airbag module and steering wheel assembly.',
    appliesTo: 'Global Platform (2022–)', readMinutes: 6,
    partIds: ['PT-7700-01A', 'PT-7700-05A'], procedureIds: [],
    sections: [{ heading: 'Wait time', body: 'Disconnect the 12 V battery and wait 90 seconds before handling the airbag module.' }],
    torqueSpecs: [{ item: 'Steering wheel nut', newtonMeters: 50 }],
    tags: ['steering', 'airbag', 'interior', 'safety', 'srs'],
  },
];
