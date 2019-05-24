package mark.thegreat.controller;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/fivehandpoker")
public class PokerController {

    @GetMapping("/getCards")
    public String getCards() {
        return "CARDS";
    }
}
