import SerialPort from "serialport";

const portName = "/dev/cu.usbmodem14631";
const serialPort = new SerialPort(portName, err => console.log(err));

export function nextUser() {
  serialPort.write("OK", err => {
    if (err) return console.log(err.message);
  });
}
