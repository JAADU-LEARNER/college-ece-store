import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'esp32-devkit-v1',
    title: 'ESP32 Wi-Fi & Bluetooth Dual Core Development Board (30-Pin)',
    category: 'Microcontrollers',
    price: 349,
    originalPrice: 499,
    stock: 12,
    shortDescription: 'Ideal for IoT, robotics, and smart college automation projects. Dual-core with 2.4GHz Wi-Fi + BLE.',
    description: 'The ESP32 DevKit V1 is a low-power, high-performance microcontroller board featuring the ESP-WROOM-32 chip. It combines Wi-Fi, Bluetooth 4.2 BLE, dual Xtensa 32-bit LX6 microprocessors, and rich peripheral interfaces. Perfect for major and minor ECE IoT projects, wireless sensor networks, and home automation prototypes.',
    specifications: [
      { label: 'Processor', value: 'Dual-core Tensilica Xtensa 32-bit LX6' },
      { label: 'Operating Voltage', value: '3.3V (5V via Micro-USB)' },
      { label: 'Clock Speed', value: 'Up to 240 MHz' },
      { label: 'Wireless', value: 'Wi-Fi 802.11 b/g/n & Bluetooth v4.2 BR/EDR and BLE' },
      { label: 'GPIO Pins', value: '30 Pins (with PWM, ADC, DAC, I2C, SPI, UART)' },
      { label: 'Flash Memory', value: '4 MB SPI Flash' }
    ],
    media: [
      {
        id: 'esp32-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
        caption: 'ESP32 DevKit V1 Top View'
      },
      {
        id: 'esp32-vid-1',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        caption: 'Hardware Demonstration & Pinout Overview'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Rohan Sharma (ECE 3rd Yr)',
        rating: 5,
        comment: 'Worked seamlessly with Arduino IDE for my Smart Irrigation project. Authentic board with no bootloader issues.',
        date: '2026-03-12',
        verifiedBuyer: true
      },
      {
        id: 'rev-2',
        reviewerName: 'Priya Verma (ECE Final Yr)',
        rating: 5,
        comment: 'Fast delivery on campus! Got it in 30 minutes right in front of the lab.',
        date: '2026-03-20',
        verifiedBuyer: true
      }
    ],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'arduino-uno-r3',
    title: 'Arduino UNO R3 DIP Board with ATmega328P Microcontroller & USB Cable',
    category: 'Microcontrollers',
    price: 399,
    originalPrice: 550,
    stock: 8,
    shortDescription: 'Standard DIP ATmega328P edition with detachable IC. Essential for 1st & 2nd year lab experiments.',
    description: 'The classic Arduino Uno R3 is the foundational microcomputing board for every engineering student. Built with the ATmega328P 8-bit AVR microcontroller, it provides 14 digital input/output pins (6 of which can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, and a power jack. Includes high-quality USB-B programming cable.',
    specifications: [
      { label: 'Microcontroller', value: 'ATmega328P DIP package' },
      { label: 'Operating Voltage', value: '5V (Input: 7-12V DC)' },
      { label: 'Digital I/O Pins', value: '14 (6 PWM outputs)' },
      { label: 'Analog Input Pins', value: '6' },
      { label: 'Clock Speed', value: '16 MHz' },
      { label: 'Flash Memory', value: '32 KB (0.5 KB used by bootloader)' }
    ],
    media: [
      {
        id: 'uno-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=800&q=80',
        caption: 'Arduino Uno R3 with Cable'
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        reviewerName: 'Aman Gupta (EE 2nd Yr)',
        rating: 4,
        comment: 'Standard DIP chip is great because if you short a pin, you can easily replace just the ATmega328 IC.',
        date: '2026-02-15',
        verifiedBuyer: true
      }
    ],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ultrasonic-sensor-hcsr04',
    title: 'HC-SR04 Ultrasonic Distance Sensor Module (2cm - 400cm)',
    category: 'Sensors & Modules',
    price: 65,
    originalPrice: 99,
    stock: 25,
    shortDescription: 'Precision non-contact sonar ranging module for obstacle avoiding robots and liquid level monitoring.',
    description: 'The HC-SR04 ultrasonic sensor uses sonar to measure distance with millimeter accuracy. Operating at 40kHz, it features transmitter, receiver, and control circuitry. Extremely easy to interface with Arduino, Raspberry Pi, and ESP32 with trigger and echo pins.',
    specifications: [
      { label: 'Power Supply', value: '5V DC' },
      { label: 'Working Current', value: '15mA' },
      { label: 'Ranging Distance', value: '2cm – 400cm' },
      { label: 'Measuring Angle', value: '15 degrees' },
      { label: 'Trigger Input Signal', value: '10µs TTL pulse' }
    ],
    media: [
      {
        id: 'sonar-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        caption: 'HC-SR04 Front Transducer View'
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        reviewerName: 'Kavita Singh (ECE 3rd Yr)',
        rating: 5,
        comment: 'Worked perfectly for our Obstacle Avoidance Rover. Accurate readings up to 3.5 meters.',
        date: '2026-03-01',
        verifiedBuyer: true
      }
    ],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l298n-motor-driver',
    title: 'L298N Dual H-Bridge DC Stepper Motor Driver Controller Board',
    category: 'Motors & Actuators',
    price: 135,
    originalPrice: 190,
    stock: 0, // Deliberately set to 0 to showcase the "Out of Stock" feature!
    shortDescription: 'High-power dual H-bridge driver capable of driving two DC motors or one 4-wire stepper motor.',
    description: 'The L298N driver module uses ST L298N chip to drive inductive loads such as relays, solenoids, DC motors, and bipolar stepping motors. Features an onboard 5V regulator, heavy heat sink, and screw terminals for easy motor wiring.',
    specifications: [
      { label: 'Driver Chip', value: 'Double H Bridge L298N' },
      { label: 'Motor Voltage', value: '5V - 35V' },
      { label: 'Peak Current', value: '2A per bridge' },
      { label: 'Logic Voltage', value: '5V' },
      { label: 'Max Power', value: '25W' }
    ],
    media: [
      {
        id: 'l298n-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
        caption: 'L298N Motor Driver with Heavy Aluminium Heatsink'
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        reviewerName: 'Vikas Patel (Mech 4th Yr)',
        rating: 4,
        comment: 'Solid driver, handles 12V 500RPM motors easily without overheating.',
        date: '2026-02-28',
        verifiedBuyer: true
      }
    ],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'fr4-double-sided-pcb-kit',
    title: 'High-Grade FR-4 Double-Sided Universal Prototype PCB Board (Pack of 5)',
    category: 'PCBs & Prototyping',
    price: 110,
    originalPrice: 160,
    stock: 18,
    shortDescription: 'Pre-tinned plated-through holes with standard 2.54mm pitch. Solder mask coated for clean soldering.',
    description: 'Universal double-sided prototype boards made from fire-retardant FR-4 fiberglass. Features tinned through-holes preventing copper pads from lifting off during high-heat soldering. Dimensions: 5cm x 7cm with 2.54mm pitch matching all standard DIP ICs and breakout boards.',
    specifications: [
      { label: 'Material', value: 'High Quality FR4 Glass Fiber' },
      { label: 'Dimensions', value: '5cm x 7cm' },
      { label: 'Hole Pitch', value: '2.54mm (0.1 inch)' },
      { label: 'Hole Diameter', value: '1.0mm' },
      { label: 'Quantity', value: 'Pack of 5 boards' }
    ],
    media: [
      {
        id: 'pcb-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        caption: 'FR4 Double Sided Solderable PCBs'
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        reviewerName: 'Rahul Mehra (ECE 2nd Yr)',
        rating: 5,
        comment: 'Much better than cheap paper phenolic boards. The copper tracks do not peel off even with beginner soldering irons.',
        date: '2026-03-05',
        verifiedBuyer: true
      }
    ],
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'oled-display-096-i2c',
    title: '0.96 inch I2C IIC 128x64 OLED Display Module (Blue & Yellow)',
    category: 'Displays',
    price: 185,
    originalPrice: 240,
    stock: 14,
    shortDescription: 'High contrast self-illuminating OLED with 4-pin I2C interface. Low power consumption.',
    description: '0.96 inch OLED display module featuring SSD1306 driver chip. Only requires 4 pins (VCC, GND, SCL, SDA) to communicate with Arduino, ESP32, STM32, or Raspberry Pi. Extremely crisp text and graphics with wide 160-degree viewing angle.',
    specifications: [
      { label: 'Resolution', value: '128 x 64 pixels' },
      { label: 'Driver IC', value: 'SSD1306' },
      { label: 'Interface', value: 'I2C (Address: 0x3C)' },
      { label: 'Operating Voltage', value: '3.3V - 5V' },
      { label: 'Colors', value: 'Yellow top bar, Blue main display' }
    ],
    media: [
      {
        id: 'oled-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        caption: '0.96 inch I2C OLED Display'
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        reviewerName: 'Divya Nair (ECE 3rd Yr)',
        rating: 5,
        comment: 'Uses U8g2 / Adafruit SSD1306 library. Very bright screen, perfect for our smart watch project.',
        date: '2026-03-18',
        verifiedBuyer: true
      }
    ],
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'soldering-iron-kit-25w',
    title: '25W Precision Soldering Iron with Stand & Solder Wire (College Lab Grade)',
    category: 'Tools & Accessories',
    price: 195,
    originalPrice: 280,
    stock: 6,
    shortDescription: 'Ergonomic 25W heating element ideal for PCB soldering, micro-components, and jumper wires.',
    description: 'High-quality copper bit 25-watt soldering iron suitable for college laboratory project prototyping. Reaches operating temperature rapidly with heat-resistant handle and safety stand.',
    specifications: [
      { label: 'Power Rating', value: '25W @ 230V AC' },
      { label: 'Tip Material', value: 'Nickel-Plated Copper Pointed Tip' },
      { label: 'Included Extras', value: '1x Safety Stand, 10g 60/40 Rosin Core Solder Wire' },
      { label: 'Cable Length', value: '1.2 Meters' }
    ],
    media: [
      {
        id: 'solder-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        caption: '25W Soldering Iron Prototyping Kit'
      }
    ],
    reviews: [
      {
        id: 'rev-8',
        reviewerName: 'Sunny Chawla (ECE 1st Yr)',
        rating: 4,
        comment: 'Heats up fast, good pointed tip for soldering small resistors and headers.',
        date: '2026-02-19',
        verifiedBuyer: true
      }
    ],
    featured: false,
    createdAt: new Date().toISOString()
  }
];
