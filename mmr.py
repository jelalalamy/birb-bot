import pyautogui
import time

time.sleep(2)

cmd = "$mmr"
TIME_BETWEEN_LETTERS = 0.01;

for i in range(1,4):
    pyautogui.write(cmd + " " + str(i), interval = TIME_BETWEEN_LETTERS)
    pyautogui.press("enter")
    time.sleep(1.5)

pyautogui.write("~catch", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
time.sleep(1.5)
pyautogui.write("~release", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")