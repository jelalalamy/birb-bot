import pyautogui
import time
from datetime import datetime

# Variables
cmd = "$mmr"
TIME_BETWEEN_LETTERS = 0.01;
todaysDate = datetime.today().strftime('%Y-%m-%d')

# Countdown before script starts, switch to Discord tab
print("Beginning script in 5");
time.sleep(1);
for i in range (4, 0, -1):
    print(i);
    time.sleep(1);

# Uploads new topk collection with today's date
pyautogui.write("$topk", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
time.sleep(1.5)
pyautogui.write("~catch topk", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
time.sleep(1.5)
pyautogui.write("~upload" + " " + todaysDate, interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
pyautogui.write("$topk 2", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
time.sleep(1.5)
pyautogui.write("~catch topk", interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
time.sleep(1.5)
pyautogui.write("~upload" + " " + todaysDate, interval = TIME_BETWEEN_LETTERS)
pyautogui.press("enter")
