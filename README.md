# Basic Equipment Scheduler

## Overview

This is a simple web application that serves as a basic drag-and-drop equipment scheduler. It allows users to schedule equipment usage by dragging and dropping items onto a grid. The grid represents days and machines, and users can easily visualize and manage equipment scheduling.

## Features

- **Drag and Drop:** Intuitive drag-and-drop functionality for easy scheduling.
- **Grid Layout:** The grid layout represents days and machines, providing a clear visualization of the schedule.
- **Save and Load:** Save the current schedule to an XML file and load it back when needed.
- **Date-based Columns:** The grid includes date-based columns, allowing users to schedule equipment for specific days.

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/equipment-scheduler.git

2. Open the `index.html` file in your web broswer
3. Use the provided interfact to drag and drop equipment onto the grid, and utilize the save and load functionalities 

## Usage 
- **Adding scheduled items:** Type the material you'd like to schedule and either click on the "+" button or press enter
- **Scheduling:** Drag the newly created div to the corresponding day and machine row. You can continue to move this around until you're happy with it's location.
- **Renaming Machines:** Click on the row headers in the leftmost column and type the name of the machine.
- **Saving:** Click on the "Save" button to save the current schedule to an XML file -- feel free to rename it.
- **Loading:** Click on the "Load" button to laod a previously saved schedule from an xml file.
- **Changing Grid Size:** With a little bit of code refactoring in a few places, you just need to change the number of rows and edit the grid style in the styles.css to the correct number of columns and rows.

## Acknowledgements 
- This project was inspired by the need of a company to switch from a manual written schedule to a digital one that can function entirely on a local device.

## Looking Forward 
- This will have a few different screens that can be displayed on a TV. It will have rotating views to prevent burnout, and will not be editable from the TV display itself.