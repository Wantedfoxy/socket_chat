from playwright.sync_api import Page, expect
from urls import reg_url, main_url
import pytest

import time
@pytest.fixture
def login(page:Page):
    page.goto(reg_url)
    page.fill('input[name="email"]',"1@1.ru")
    page.fill('input[name="password"]',"password")
    page.click("button[class='login-btn']")
    expect(page.get_by_label("div[class='chat-name']"))

@pytest.fixture
def open_popup(login,page:Page):
    page.click("button[class='group-mailing-btn']")
    expect(page.get_by_label("div[class='popup' style*='display:flex']"))




def test_registration(page:Page):
    page.goto(reg_url)
    #enter login and password
    page.fill('input[name="email"]',"1@1.ru")
    page.fill('input[name="password"]',"password")
    page.click("button[class='login-btn']")

    #expecting chat page with Name Sername and number of group
    expect(page.get_by_label("div[class='chat-name']"))
    
def test_entering_message(login,page:Page):
    page.fill("input[placeholder='Сообщение']", "test123")
    page.click("svg[class='send-message-btn']")
    expect(page.get_by_label("div[class='message-box']"))


def test_close_popup(login,page:Page):
    page.click("button[class='group-mailing-btn']")
    expect(page.get_by_label("div[class='popup' style*='display:flex']"))

def test_write_to_group(open_popup,page:Page):
    page.click("span[class='close-btn']")
    expect(page.get_by_label("div[class='popup' style*='display:none']"))