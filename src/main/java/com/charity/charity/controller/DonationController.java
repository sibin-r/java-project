package com.charity.charity.controller;
import java.util.*;
import com.charity.charity.model.Donation;
import com.charity.charity.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.charity.charity.model.User;


@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping("/donate/{eventId}")
    public Donation donate(@PathVariable Long eventId, @RequestBody Map<String, Object> payload) {
        String donorName = (String) payload.get("donorName");
        Double amount = Double.valueOf(payload.get("amount").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
    
        User user = donationService.getUserById(userId); // ✅ NEW
    
        Donation donation = new Donation();
        donation.setDonorName(donorName);
        donation.setAmount(amount);
        donation.setUser(user); 
        return donationService.donateToEvent(eventId, donation);
    }
    
    // In the DonationController, modify the GET endpoint to return the donations with event names
    @GetMapping
   public List<Map<String, Object>> getAllDonations() {
    List<Donation> donations = donationService.getAllDonations();
    List<Map<String, Object>> donationList = new ArrayList<>();
    
    for (Donation donation : donations) {
        Map<String, Object> donationDetails = new HashMap<>();
        donationDetails.put("donorName", donation.getDonorName());
        donationDetails.put("amount", donation.getAmount());
        donationDetails.put("eventName", donation.getEvent().getName()); // Add event name here
        donationList.add(donationDetails);
    }
    
    return donationList;
}
    
@GetMapping("/user/{userId}")
public List<Map<String, Object>> getDonationsByUser(@PathVariable Long userId) {
    List<Donation> donations = donationService.getDonationsByUserId(userId);
    List<Map<String, Object>> donationList = new ArrayList<>();

    for (Donation donation : donations) {
        Map<String, Object> donationDetails = new HashMap<>();
        donationDetails.put("donorName", donation.getDonorName());
        donationDetails.put("amount", donation.getAmount());
        donationDetails.put("eventName", donation.getEvent().getName());
        donationList.add(donationDetails);
    }

    return donationList;
}

}
