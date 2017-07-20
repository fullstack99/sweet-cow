//
//  MessagesViewController.swift
//  SweetCowMessages
//
//  Created by Dustin Mallory on 4/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import Messages
import KarmiesSDK

class MessagesViewController: KarmiesMessagesAppViewController {
  
  override var clientID: String {
    return "sweetcow"
  }
  
  override var monitorLocation: Bool {
    return true
  }
  
  override var alwaysLocation: Bool {
    return true
  }
  
  var actionStyle: KarmiesActionStyle {
    return .picker
  }
}
