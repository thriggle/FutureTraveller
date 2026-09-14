"""
Offscreen UI tests for Ship Helper Qt Widgets.
"""
import sys
import unittest
from PySide6.QtWidgets import QApplication
from ship_helper.ui.main_window import ShipHelperMainWindow
from ship_helper.ui.dialogs.mission_code_dialog import MissionCodeDialog
from ship_helper.ui.dialogs.jump_field_dialog import JumpFieldDialog
from ship_helper.ui.dialogs.component_dialogs import HullDialog, DriveDialog, WeaponDialog, GenericComponentDialog
from ship_helper.exporters.fillform_viewer import FillformViewer

app = QApplication.instance()
if not app:
    app = QApplication(sys.argv)

class TestShipUI(unittest.TestCase):
    def test_main_window_instantiation(self):
        win = ShipHelperMainWindow()
        self.assertIsNotNone(win)
        self.assertIsNotNone(win.ribbon)
        self.assertIsNotNone(win.palette)
        self.assertIsNotNone(win.current_view)
        self.assertIsNotNone(win.stats_panel)

        # Starts with a blank ship (no subhulls)
        self.assertEqual(len(win.ship.subhulls), 0)
        win._refresh_all()

    def test_dialogs_instantiation(self):
        win = ShipHelperMainWindow()
        dlg_code = MissionCodeDialog(win.ship)
        self.assertIsNotNone(dlg_code)

        dlg_jump = JumpFieldDialog(win.ship)
        self.assertIsNotNone(dlg_jump)

        # Test component dialogs
        dlg_hull = HullDialog(base_tl=13)
        self.assertIsNotNone(dlg_hull)

        dlg_drive = DriveDialog(drive_type="Jump", base_tl=13)
        self.assertIsNotNone(dlg_drive)

        dlg_wpn = WeaponDialog(weapon_key="BeamLaser", base_tl=13)
        self.assertIsNotNone(dlg_wpn)

        dlg_gen = GenericComponentDialog(category="accommodation", item_key="StandardStateroom", base_tl=13)
        self.assertIsNotNone(dlg_gen)

        viewer = FillformViewer(win.ship)
        self.assertIsNotNone(viewer)
        p1 = viewer._render_page_1()
        p2 = viewer._render_page_2()
        p3 = viewer._render_page_3()
        self.assertIn("Page 1", p1)
        self.assertIn("Page 2", p2)
        self.assertIn("Page 3", p3)

if __name__ == "__main__":
    unittest.main()
