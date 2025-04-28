import os
import time
import glob
import shutil
from datetime import datetime, timedelta
from random import randint

from selenium import webdriver  # pip3 install selenium --break-system-packages
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


def get_date():
    x = datetime.now()
    return x
    return {
        "year": "%04d" % (x.year,),
        "month": "%02d" % (x.month,),
        "day": "%02d" % (x.day,),
    }

    day = time.strftime("%d")
    month = time.strftime("%m")
    year = time.strftime("%Y")
    return {"year": year, "month": month, "day": day}


def prepare(year, month, day):
    dirname = os.path.join("temp", "downloads", f"{year}-{month}-{day}.temp")

    if os.path.isdir(os.path.join("temp", "downloads", f"{year}-{month}-{day}")):
        return False
    elif os.path.isdir(dirname):
        return False

    os.makedirs(dirname, exist_ok=True)
    return True


def get_press_release(year, month, day, link):

    # https://stackoverflow.com/a/53657649
    chrome_options = Options()
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-gpu")
    # chrome_options.add_argument("--no-sandbox") # linux only
    chrome_options.add_argument("--headless=new")  # for Chrome >= 109

    # beta START
    service = webdriver.ChromeService(
        executable_path="/home/harekaze/python/ppce/hkcas/chromedriver-linux64/chromedriver"
    )
    # beta END
    driver = webdriver.Chrome(service=service, options=chrome_options)
    # or
    # driver = webdriver.Firefox()

    driver.get(link)
    # print("title:", driver.title)

    pressrelease = driver.find_element(By.ID, "pressrelease")
    # print("pressrelease:", pressrelease.text)
    with open(
        os.path.join(
            "temp", "downloads", f"{year}-{month}-{day}.temp", f"{driver.title}.txt"
        ),
        "w",
    ) as f:
        f.write(f"{pressrelease.text}")

    time.sleep(randint(1, 2) * 0.3)
    driver.quit()


def get_press_releases(year, month, day):

    # https://stackoverflow.com/a/53657649
    chrome_options = Options()
    # chrome_options.add_argument("--disable-extensions")
    # chrome_options.add_argument("--disable-gpu")
    # chrome_options.add_argument("--no-sandbox") # linux only
    chrome_options.add_argument("--headless=new")  # for Chrome >= 109

    # beta START
    service = webdriver.ChromeService(
        executable_path="/home/harekaze/python/ppce/hkcas/chromedriver-linux64/chromedriver"
    )
    # beta END
    driver = webdriver.Chrome(service=service, options=chrome_options)
    # or
    # driver = webdriver.Firefox()

    driver.get(f"https://www.info.gov.hk/gia/general/{year}{month}/{day}c.htm")

    contents = driver.find_elements(
        By.CSS_SELECTOR, "#contentBody > div > div.leftBody > ul > li > a"
    )

    datas = []
    for content in contents:
        # print("content:", content.text)
        # print("href:", content.get_attribute("href"))
        datas.append({"title": content.text, "link": content.get_attribute("href")})

    time.sleep(randint(1, 2) * 0.3)
    driver.quit()

    return datas


if __name__ == "__main__":
    try:
        start_date = get_date()
        current_date = start_date

        for f in glob.glob(os.path.join("temp", "downloads", f"*.temp")):
            # print (f)#temp
            shutil.rmtree(f)

        while 1:

            if not (
                current_date.year == start_date.year
                and current_date.month == start_date.month
                and current_date.day == start_date.day
            ):
                year = "%04d" % (current_date.year)
                month = "%02d" % (current_date.month)
                day = "%02d" % (current_date.day)

                # auto skip if directory exists already
                if prepare(year, month, day):

                    datas = get_press_releases(year, month, day)
                    print(f"Press releases in {year}-{month}-{day}: {len(datas)}")
                    if len(datas) == 0:
                        break

                    for data in datas:
                        print(data["title"])
                        get_press_release(year, month, day, data["link"])
                    """
                    #or
                    #test only
                    with open(f'{os.path.join("temp", "downloads", f"{year}-{month}-{day}.temp", "test.txt")}', 'a') as f:
                        f.write('test\n')
                    time.sleep(1)
                    """

                    # remove '.temp' in directory
                    os.rename(
                        os.path.join("temp", "downloads", f"{year}-{month}-{day}.temp"),
                        os.path.join("temp", "downloads", f"{year}-{month}-{day}"),
                    )

                    print("")

            current_date -= timedelta(days=1)
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
    except Exception as e:
        print(f"[Error] {e}")
